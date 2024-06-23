import * as path from 'path'
import { promises as fs } from 'fs'
import pg from 'pg'
import { Kysely, Migrator, PostgresDialect, FileMigrationProvider } from 'kysely'
import { run } from '../src'

const migrationFolder = new URL('../migrations', import.meta.url).pathname

const db = new Kysely<any>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: 'postgres://postgres:postgres@127.0.0.1:45432/postgres',
    }),
  }),
})

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder,
  }),
})

run(migrator, migrationFolder).then(db.destroy)
