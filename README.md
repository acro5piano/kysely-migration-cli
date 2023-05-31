# kysely-migration-cli

Thin migration cli **library** for [Kysely](https://github.com/koskimas/kysely)

# Getting started

```
npm install --save kysely-migration-cli
```

Or if you use Yarn:

```
yarn add kysely-migration-cli
```

# Usage

`kysely-migration-cli` is just a **library** which help you to write a migration script, and not intended to provide a command to migrate.

Create a migration script like this:

```typescript
// scripts/migrate.ts

import { Kysely, Migrator, PostgresDialect, FileMigrationProvider } from 'kysely'
import { run } from 'kysely-migration-cli'

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
```

Output:

```
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

# Migration creation

The `create` command generates a migration boilorplate with the current timestamp. If you run `node -r ts-node/register scripts/migrate.ts create initial`, then it creates file like `migrations/20220222T044655-initial.ts` which contains the following code.

```ts
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {}

export async function down(db: Kysely<any>): Promise<void> {}
```

If you want to change the path contains migration files, please modify the CLI code like this:

```typescript
// scripts/migrate.ts

// ...

run(db, migrator, 'path-to-migration-files')
```

# Experimental: CLI without a script file

Important NOTEs:

- This is an experimental feature and the behaviour might change in the future.
- Currently it works with Postgres only.

You can run `kysely-migration-cli` without a script file.

```
export DATABASE_URL=postgres://postgres:postgres@127.0.0.1:27253/postgres
npm run kysely-migration-cli
```

If you place `.env` file which contains `DATABASE_URL=postgres://...`, the CLI automatically loads it before execution.

To compile typescript, `kysely-migration-cli` should register Node's hook api. Currently it supports the following transpiers:

- `esbuild-register`
- `ts-node/register/transpile-only`
- `@swc-node/register`

If you need more, please create a pull request.
