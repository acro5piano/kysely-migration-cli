#!/usr/bin/env node

import { run } from '.'
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from 'kysely'

const { DATABASE_URL } = process.env

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const db = new Kysely({
  dialect: new PostgresDialect({
    connectionString: DATABASE_URL,
  }),
})

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider('./migrations'),
})

run(db, migrator)
