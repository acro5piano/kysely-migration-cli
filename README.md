# kysely-migration-cli

Thin migration cli for [Kysely](https://github.com/koskimas/kysely)

# Getting started

```
$ yarn add kysely-migration-cli@0.0.2-dev
```

# Usage

Create migration script:

```typescript
// scripts/migrate.ts

import { run } from 'kysely-migration-cli'
import { Kysely, Migrator, PostgresDialect, FileMigrationProvider } from 'kysely'

const db = new Kysely<any>({
  dialect: new PostgresDialect({
    connectionString: process.env.DATABASE_URL,
  }),
})

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider('./migrations'),
})

run(db, migrator)
```

Then run:

```bash
# Do whichever tool you want to use
#
# $ node -r esbuild-register scripts/migrate.ts -h
# $ node -r ts-node/register scripts/migrate.ts -h
# $ node -r babel-node/register scripts/migrate.ts -h
# $ ts-node scripts/migrate.ts -h
# $ yarn tsc && node scripts/migrate.js -h

$ node -r esbuild-register scripts/migrate.ts -h

Usage: migrate [options] [command]

Options:
  -h, --help           display help for command

Commands:
  up                   Run a pending migration if any
  down                 Revert the latest migration with a down file
  redo                 Down and Up
  latest               Run all pending migrations
  create <input-file>  Create a new migration with the given description, and the current
                       time as the version
  help [command]       display help for command
```
