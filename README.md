# kysely-migration-cli

A lightweight migration CLI **library** for [Kysely](https://github.com/koskimas/kysely)

# Getting started

```
npm install --save kysely-migration-cli
```

If you prefer Yarn:

```
yarn add kysely-migration-cli
```

# Usage

`kysely-migration-cli` is a **library** designed to assist you in creating your own migration script. It does not aim to provide an executable command.

Create a migration script as shown below:

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
# Choose your preferred tool
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
Usage: kysely-migration-cli [options] [command]

Options:
  -h, --help                display help for command

Commands:
  up                        Run a pending migration if any
  down                      Revert the latest migration with a down file
  redo                      Down and Up
  latest                    Run all pending migrations
  down-to <migration-name>  Migrates down to the specified migration name. Specify
                            "NO_MIGRATIONS" to migrate all the way down.
  create <input-file>       Create a new migration with the given description, and
                            the current time as the version
  help [command]            display help for command
```

# Migration creation

The `create` command generates a migration boilorplate with the current timestamp. For example, running `node -r ts-node/register scripts/migrate.ts create initial` creates a file named `migrations/20220222T044655-initial.ts` with the following code:

<!-- prettier-ignore -->
```ts
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
```

If you want to change the path where migration files are stored, please modify the CLI code as follows:

```typescript
// scripts/migrate.ts

// ...

run(db, migrator, 'dir/to/migration/files')
```

# Experimental: CLI without a script file

Important Notes:

- This is an experimental feature, and the behavior may change in the future.
- Currently, it only works with Postgres.

You can run `kysely-migration-cli` without a script file.

```
env DATABASE_URL=postgres://postgres:postgres@127.0.0.1:27253/postgres \
  npm run kysely-migration-cli
```

If you place an `.env` file containing `DATABASE_URL=postgres://...`, the CLI will automatically load it before execution. To enable this, you need to install the dotenv module.

To compile typescript, `kysely-migration-cli` attempts to register a transpiler using Node's hook api. It currently supports the following transpilers:

- `esbuild-register`
- `ts-node/register/transpile-only`
- `@swc-node/register`

If you require additional support, please submit a pull request.
