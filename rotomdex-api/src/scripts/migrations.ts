import 'dotenv/config'
import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

async function runMigrations() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  })

  try {
    await client.connect()

    const migrationsDirectory = path.resolve(
      process.cwd(),
      'database',
      'migrations',
    )

    const migrationFiles = fs
      .readdirSync(migrationsDirectory)
      .filter(file => file.endsWith('.sql'))
      .sort()

    for (const file of migrationFiles) {
      console.log(`Running ${file}`)

      const sql = fs.readFileSync(
        path.join(migrationsDirectory, file),
        'utf8',
      )

      await client.query(sql)

      console.log(`✓ ${file}`)
    }

    console.log('All migrations executed successfully.')
  } finally {
    await client.end()
  }
}

runMigrations()