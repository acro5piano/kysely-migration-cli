import fs from 'fs'

import { program } from 'commander'
import { Kysely, MigrationResultSet, Migrator } from 'kysely'

function showResults({ error, results }: MigrationResultSet) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  results?.forEach((it) => console.log(`> ${it.migrationName}`))
}

export function run(
  db: Kysely<any>,
  migrator: Migrator,
  path: string = './migrations',
) {
  program.command('up').action(async () => {
    console.log('Running single migration')
    const results = await migrator.migrateUp()
    showResults(results)
  })

  program.command('latest').action(async () => {
    console.log('Running migrations')
    const results = await migrator.migrateToLatest()
    showResults(results)
  })

  program.command('down').action(async () => {
    console.log('Reverting migrations')
    const results = await migrator.migrateDown()
    showResults(results)
  })

  program.command('redo').action(async () => {
    console.log('Reverting migrations')
    let results = await migrator.migrateDown()
    showResults(results)
    console.log('Running single migration')
    results = await migrator.migrateUp()
    showResults(results)
  })

  program
    .command('create')
    .argument('<input-file>')
    .action(async (name) => {
      const dateStr = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0]
      const fileName = `${path}/${dateStr}-${name}.ts`
      if (!fs.lstatSync(path).isDirectory()) {
        fs.mkdirSync(path)
      }
      fs.writeFileSync(fileName, TEMPLATE, 'utf8')
      console.log('Created Migration:', fileName)
    })

  program.parseAsync().then(() => db.destroy())
}

const TEMPLATE = `import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
`
