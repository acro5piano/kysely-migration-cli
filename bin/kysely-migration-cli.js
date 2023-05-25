#!/usr/bin/env node

let registered = false

const tryRegister = (pkg) => {
  try {
    require(pkg)
    registered = true
    console.log(`registered ${pkg}`)
  } catch (err) {}
}

tryRegister('esbuild-register')
tryRegister('ts-node/register/transpile-only')
tryRegister('@swc-node/register')

if (!registered) {
  console.log('Warning: all of supported typescript transpile registration failed')
}

require('../dist/cli').main()
