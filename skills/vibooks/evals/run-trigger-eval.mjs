#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

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

function runOne(command, query, timeoutMs) {
  const result = spawnSync('/bin/bash', ['-lc', command], {
    encoding: 'utf8',
    timeout: timeoutMs,
    env: {
      ...process.env,
      TRIGGER_EVAL_QUERY: query,
    },
  })

  return {
    status: result.status,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error ? String(result.error) : null,
  }
}

function summarizeQuery(entry, runs, threshold, matcher, command, timeoutMs) {
  const attempts = []
  let triggers = 0

  for (let run = 0; run < runs; run += 1) {
    const attempt = runOne(command, entry.query, timeoutMs)
    const combined = `${attempt.stdout}\n${attempt.stderr}`
    const triggered = matcher.test(combined)
    matcher.lastIndex = 0

    if (triggered) {
      triggers += 1
    }

    attempts.push({
      run: run + 1,
      triggered,
      status: attempt.status,
      signal: attempt.signal,
      error: attempt.error,
    })
  }

  const triggerRate = triggers / runs
  const passed = entry.should_trigger ? triggerRate >= threshold : triggerRate < threshold

  return {
    query: entry.query,
    should_trigger: entry.should_trigger,
    triggers,
    runs,
    trigger_rate: triggerRate,
    passed,
    attempts,
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const queries = loadQueries(args.queries)
  const matcher = new RegExp(args.match, 'm')
  const results = queries.map((entry) =>
    summarizeQuery(entry, args.runs, args.threshold, matcher, args.command, args.timeoutMs),
  )

  const passed = results.filter((entry) => entry.passed).length
  const failed = results.length - passed

  const summary = {
    queries_file: args.queries,
    command: args.command,
    match: args.match,
    runs: args.runs,
    threshold: args.threshold,
    passed,
    failed,
    pass_rate: results.length === 0 ? 1 : passed / results.length,
    results,
  }

  console.log(JSON.stringify(summary, null, 2))
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
