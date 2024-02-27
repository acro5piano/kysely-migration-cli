import fs from 'fs'

import { program } from '@commander-js/extra-typings'
import { Kysely, MigrationResultSet, Migrator, NO_MIGRATIONS } from 'kysely'

function showResults({ error, results }: MigrationResultSet) {
  if (results) {
    results.forEach((it) => console.log(`> ${it.status}: ${it.migrationName} (${it.direction})`))
    if (results.length === 0) {
      console.log('> No pending migrations to execute')
    }
  }
  if (error) {
    console.error(error)
    process.exit(1)
  }
}

export function run(db: Kysely<any>, migrator: Migrator, path: string = './migrations') {
  program
    .command('up')
    .description('Run a pending migration if any')
    .action(async () => {
      console.log('Running single migration')
      const results = await migrator.migrateUp()
      showResults(results)
    })

  program
    .command('down')
    .description('Revert the latest migration with a down file')
    .action(async () => {
      console.log('Reverting migrations')
      const results = await migrator.migrateDown()
      showResults(results)
    })

  program
    .command('redo')
    .description('Down and Up')
    .action(async () => {
      console.log('Reverting migrations')
      let results = await migrator.migrateDown()
      showResults(results)
      console.log('Running single migration')
      results = await migrator.migrateUp()
      showResults(results)
    })

  program
    .command('latest')
    .description('Run all pending migrations')
    .action(async () => {
      console.log('Running migrations')
      const results = await migrator.migrateToLatest()
      showResults(results)
    })

  program
    .command('down-to')
    .argument('<migration-name>')
    .description(
      'Migrates down to the specified migration name. Specify "NO_MIGRATIONS" to migrate all the way down.',
    )
    .action(async (name) => {
      let results: MigrationResultSet

      if (name === 'NO_MIGRATIONS') {
        console.log(`Migrating all the way down`)
        results = await migrator.migrateTo(NO_MIGRATIONS)
      } else {
        console.log(`Migrating down to ${name}`)
        results = await migrator.migrateTo(name)
      }
      showResults(results)
    })

  program
    .command('create')
    .argument('<input-file>')
    .option('--template <template>')
    .description(
      'Create a new migration with the given description, and the current time as the version',
    )
    .action(async (name, options) => {
      const dateStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
      const fileName = `${path}/${dateStr}-${name}.ts`
      const mkdir = () => fs.mkdirSync(path)

      let migrationTemplate = DEFAULT_TEMPLATE

      try {
        if (options.template) {
          migrationTemplate = fs.readFileSync(options.template, 'utf8')
        }

        if (!fs.lstatSync(path).isDirectory()) {
          mkdir()
        }
      } catch {
        fs.mkdirSync(path)
      }
      fs.writeFileSync(fileName, migrationTemplate, 'utf8')
      console.log('Created Migration:', fileName)
    })

  program.parseAsync().then(() => db.destroy())
}

const DEFAULT_TEMPLATE = `import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
`
