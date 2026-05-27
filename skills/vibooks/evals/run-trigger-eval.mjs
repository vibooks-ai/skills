#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'

const OUTPUT_EXCERPT_CHARS = 4000
const MATCH_BUFFER_CHARS = 20000
const RATE_LIMIT_PATTERNS = [
  /"error":"rate_limit"/,
  /"status":"rejected".*"rateLimitType"/,
  /You've hit your limit/,
]

function parseArgs(argv) {
  const args = {
    runs: 3,
    threshold: 0.5,
    timeoutMs: 120000,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--queries') {
      args.queries = argv[++i]
    } else if (arg === '--command') {
      args.command = argv[++i]
    } else if (arg === '--match') {
      args.match = argv[++i]
    } else if (arg === '--runs') {
      args.runs = Number(argv[++i])
    } else if (arg === '--threshold') {
      args.threshold = Number(argv[++i])
    } else if (arg === '--timeout-ms') {
      args.timeoutMs = Number(argv[++i])
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  if (!args.queries) {
    throw new Error('Missing --queries <file>')
  }
  if (!args.command) {
    throw new Error('Missing --command <shell command>')
  }
  if (!args.match) {
    throw new Error('Missing --match <regex>')
  }
  if (!Number.isFinite(args.runs) || args.runs <= 0) {
    throw new Error('--runs must be a positive number')
  }
  if (!Number.isFinite(args.threshold) || args.threshold < 0 || args.threshold > 1) {
    throw new Error('--threshold must be between 0 and 1')
  }
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs <= 0) {
    throw new Error('--timeout-ms must be a positive number')
  }

  return args
}

function loadQueries(filePath) {
  const parsed = JSON.parse(readFileSync(filePath, 'utf8'))

  if (!Array.isArray(parsed)) {
    throw new Error('Query file must contain a JSON array')
  }

  for (const [index, entry] of parsed.entries()) {
    if (typeof entry?.query !== 'string' || typeof entry?.should_trigger !== 'boolean') {
      throw new Error(`Invalid query entry at index ${index}`)
    }
  }

  return parsed
}

function appendBounded(current, chunk, maxChars) {
  const next = current + chunk
  return next.length > maxChars ? next.slice(next.length - maxChars) : next
}

function runOne(command, query, timeoutMs, matcher) {
  return new Promise((resolve) => {
    const child = spawn('/bin/bash', ['-lc', command], {
      env: {
        ...process.env,
        TRIGGER_EVAL_QUERY: query,
      },
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdoutExcerpt = ''
    let stderrExcerpt = ''
    let matchBuffer = ''
    let triggered = false
    let timedOut = false
    let rateLimited = false
    let spawnError = null
    let settled = false

    const stopChild = (signal) => {
      if (child.killed) {
        return
      }

      try {
        process.kill(-child.pid, signal)
      } catch {
        child.kill(signal)
      }
    }

    const finish = (status, signal) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeout)

      const stoppedAfterMatch = triggered && !timedOut && spawnError === null
      const commandFailed = !stoppedAfterMatch && (status !== 0 || signal !== null)
      const executionFailed = timedOut || rateLimited || spawnError !== null
      let error = null

      if (timedOut) {
        error = `Error: command timed out after ${timeoutMs}ms`
      } else if (rateLimited) {
        error = 'Error: client rate limit'
      } else if (spawnError) {
        error = String(spawnError)
      } else if (commandFailed) {
        error = `Error: command exited with status ${status ?? 'null'} signal ${signal ?? 'null'}`
      }

      resolve({
        triggered,
        execution_failed: executionFailed,
        command_failed: commandFailed,
        timed_out: timedOut,
        rate_limited: rateLimited,
        status,
        signal,
        error,
        stdout_excerpt: stdoutExcerpt,
        stderr_excerpt: stderrExcerpt,
      })
    }

    const checkMatch = (chunk) => {
      matchBuffer = appendBounded(matchBuffer, chunk, MATCH_BUFFER_CHARS)
      if (!rateLimited && RATE_LIMIT_PATTERNS.some((pattern) => pattern.test(matchBuffer))) {
        rateLimited = true
      }
      if (triggered || !matcher.test(matchBuffer)) {
        matcher.lastIndex = 0
        return
      }

      matcher.lastIndex = 0
      triggered = true
      stopChild('SIGTERM')
    }

    const timeout = setTimeout(() => {
      timedOut = true
      stopChild('SIGTERM')
    }, timeoutMs)

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdoutExcerpt = appendBounded(stdoutExcerpt, chunk, OUTPUT_EXCERPT_CHARS)
      checkMatch(chunk)
    })
    child.stderr.on('data', (chunk) => {
      stderrExcerpt = appendBounded(stderrExcerpt, chunk, OUTPUT_EXCERPT_CHARS)
      checkMatch(chunk)
    })
    child.on('error', (error) => {
      spawnError = error
    })
    child.on('close', finish)
  })
}

async function summarizeQuery(entry, runs, threshold, matcher, command, timeoutMs) {
  const attempts = []
  let triggers = 0
  let executionFailures = 0

  for (let run = 0; run < runs; run += 1) {
    const attempt = await runOne(command, entry.query, timeoutMs, matcher)
    if (attempt.triggered) {
      triggers += 1
    }
    if (attempt.execution_failed) {
      executionFailures += 1
    }

    attempts.push({
      run: run + 1,
      triggered: attempt.triggered,
      execution_failed: attempt.execution_failed,
      command_failed: attempt.command_failed,
      timed_out: attempt.timed_out,
      rate_limited: attempt.rate_limited,
      status: attempt.status,
      signal: attempt.signal,
      error: attempt.error,
      stdout_excerpt: attempt.stdout_excerpt,
      stderr_excerpt: attempt.stderr_excerpt,
    })
  }

  const triggerRate = triggers / runs
  const executionFailed = executionFailures > 0
  const passed =
    !executionFailed && (entry.should_trigger ? triggerRate >= threshold : triggerRate < threshold)

  return {
    query: entry.query,
    should_trigger: entry.should_trigger,
    triggers,
    runs,
    trigger_rate: triggerRate,
    execution_failed: executionFailed,
    execution_failures: executionFailures,
    passed,
    attempts,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const queries = loadQueries(args.queries)
  const matcher = new RegExp(args.match, 'm')
  const results = []

  for (const entry of queries) {
    results.push(await summarizeQuery(entry, args.runs, args.threshold, matcher, args.command, args.timeoutMs))
  }

  const passed = results.filter((entry) => entry.passed).length
  const failed = results.length - passed
  const executionFailed = results.some((entry) => entry.execution_failed)
  const executionFailures = results.reduce((total, entry) => total + entry.execution_failures, 0)
  const commandFailures = results.reduce(
    (total, entry) => total + entry.attempts.filter((attempt) => attempt.command_failed).length,
    0,
  )

  const summary = {
    queries_file: args.queries,
    command: args.command,
    match: args.match,
    runs: args.runs,
    threshold: args.threshold,
    timeout_ms: args.timeoutMs,
    passed,
    failed,
    execution_failed: executionFailed,
    execution_failures: executionFailures,
    command_failures: commandFailures,
    pass_rate: results.length === 0 ? 1 : passed / results.length,
    results,
  }

  console.log(JSON.stringify(summary, null, 2))
  if (executionFailed) {
    process.exitCode = 2
  } else if (failed > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
