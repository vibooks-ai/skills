import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const runner = fileURLToPath(new URL('./run-trigger-eval.mjs', import.meta.url))

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`
}

function runFixture(output, shouldTrigger) {
  const directory = mkdtempSync(join(tmpdir(), 'vibooks-trigger-stream-'))
  try {
    const queries = join(directory, 'queries.json')
    const client = join(directory, 'client.mjs')
    writeFileSync(queries, JSON.stringify([{ query: 'synthetic fixture', should_trigger: shouldTrigger }]))
    writeFileSync(client, `process.stdout.write(${JSON.stringify(output)})\n`)
    const result = spawnSync(process.execPath, [runner,
      '--queries', queries,
      '--runs', '1',
      '--command', `${shellQuote(process.execPath)} ${shellQuote(client)}`,
      '--match', '"type":"command_execution".*SKILL\\.md',
    ], { encoding: 'utf8', timeout: 10_000 })
    assert.equal(result.error, undefined)
    return { status: result.status, summary: JSON.parse(result.stdout) }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

test('finds a command event before a long result in one output write', () => {
  const output = '{"type":"command_execution","command":"cat .agents/skills/vibooks/SKILL.md"}\n'
    + 'x'.repeat(40_000)
  const result = runFixture(output, true)
  assert.equal(result.status, 0)
  assert.equal(result.summary.passed, 1)
  assert.equal(result.summary.results[0].attempts[0].triggered, true)
})

test('does not lose a rate-limit marker before a long result', () => {
  const result = runFixture("You've hit your limit\n" + 'x'.repeat(40_000), false)
  assert.equal(result.status, 2)
  assert.equal(result.summary.execution_failed, true)
  assert.equal(result.summary.results[0].attempts[0].rate_limited, true)
})
