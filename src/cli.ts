import { run } from '.'
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import path from 'path'
import { promises as fs } from 'fs'
import { Pool } from 'pg'

const dotenvPath = process.env.DOTENV_CONFIG_PATH || '.env'

/**
 * Load Dotenv if the module exists.
 */
try {
  require('dotenv').config({
    debug: !!process.env.DOTENV_CONFIG_DEBUG,
    path: dotenvPath,
    encoding: process.env.DOTENV_CONFIG_ENCODING,
  })
} catch {}

const { DATABASE_URL } = process.env

if (!DATABASE_URL) {
  const hint = `Error: DATABASE_URL not set.

Please specify DATABASE_URL to run this CLi. Try the following:
  - Run \`DATABASE_URL=postgres://user:password@host:port/database && npm run kysely-migration-cli\`
  - Place ${dotenvPath} file containing \`DATABASE_URL=postgres://user:password@host:port/database\`
`
  console.log(hint)
  process.exit(1)
}

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: DATABASE_URL,
    }),
  }),
})

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    path,
    fs,
    migrationFolder: path.resolve(process.cwd(), './migrations'),
  }),
})

export function main() {
  run(db, migrator)
}
