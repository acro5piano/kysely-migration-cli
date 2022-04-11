# kysely-migration-cli

Thin migration cli for Kysely

# Getting started

```
yarn add kysely-migration-cli@0.0.2-dev
```

# Usage

Create migration script:

```typescript
// scripts/migrate.ts

import { run } from 'kysely-migration-cli'
import { Kysely, Migrator, PostgresDialect } from 'kysely'

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

```
$ node -r esbuild-register scripts/migrate.ts -h
Usage: migrate [options] [command]

Options:
  -h, --help           display help for command

Commands:
  up
  latest
  down
  redo
  create <input-file>
  help [command]       display help for command

```
