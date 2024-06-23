import { test } from 'node:test'
import { execa } from 'execa'

test('up', async () => {
  await execa('node', ['-r', 'esbuild-register', './tests/test-cli.ts', 'up'])
})
