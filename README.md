# kysely-migration-cli

A lightweight migration CLI **library** for [Kysely](https://github.com/koskimas/kysely)

# Installation

Install using the dependency manager of your choice

```typescript
// NPM
npm install --save kysely-migration-cli

// PNPM
pnpm add kysely-migration-cli

// YARN
yarn add kysely-migration-cli
```

# Usage

`kysely-migration-cli` is a **library** designed to assist you in creating your own migration script. It does not aim to provide an executable command.

Create a migration script as shown below:

```typescript
// scripts/migrate.ts

import * as path from 'path'
import { promises as fs } from 'fs'
import pg from 'pg'
import { Kysely, Migrator, PostgresDialect, FileMigrationProvider } from 'kysely'
import { run } from 'kysely-migration-cli'

// For ESM environment
const migrationFolder = new URL('../migrations', import.meta.url).pathname

// For CJS environment
// const migrationFolder = path.join(__dirname, '../migrations')

const db = new Kysely<YourDbType>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder,
  }),
})

run(db, migrator, migrationFolder)
```

Note: The above script assumes your migration folder is located at the same directory of chdir and named `./migrations`

Then run:

```bash
# Choose your preferred tool. Here are some examples:
#
#   $ node -r esbuild-register scripts/migrate.ts -h
#   $ node -r ts-node/register scripts/migrate.ts -h
#   $ node -r babel-node/register scripts/migrate.ts -h
#   $ ts-node-transpile-only scripts/migrate.ts -h
#   $ npm run tsc && node scripts/migrate.js -h
#   $ bun run scripts/migrate.ts -h

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
import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
```

If you want to modify the default template, you can pass an option `--template=yourtemplate.txt` pointing to a file containing the custom template

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
env DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/postgres \
  npm run kysely-migration-cli
```

If you place an `.env` file containing `DATABASE_URL=postgres://...`, the CLI will automatically load it before execution. To enable this, you need to install the dotenv module (`npm install dotenv`) .

To transpile TypeScript, `kysely-migration-cli` attempts to register a transpiler using Node's hook api. It currently supports the following transpilers:

- `esbuild-register`
- `ts-node/register/transpile-only`
- `@swc-node/register`

> Of course, they are not required for platforms which supports TypeScript natively, such as `Deno` and `Bun`.

If you require additional registration supports, please submit a pull request.

# Difference from kysely-ctl

Kysely has now the official CLI called `kysely-ctl`. It's actively maintianed and covers broader features, while `kysely-migration-cli` has less dependencies.

https://github.com/kysely-org/kysely-ctl

For more details, please take a look at: https://github.com/acro5piano/kysely-migration-cli/issues/28

# License

Copyright © 2022 [Kay Gosho](https://github.com/acro5piano) (@acro5piano).

This project is licensed under the MIT License - see the LICENSE file for details.
