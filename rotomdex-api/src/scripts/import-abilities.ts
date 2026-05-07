import fs from 'fs'
import 'dotenv/config'
import 'reflect-metadata'
import { parse } from 'csv-parse'
import { DataSource, EntitySchema } from 'typeorm'

type AbilitiesCsvRow = {
  id: string
  name: string
  generation_introduced: string
  description?: string
  short_description?: string
}

const AbilitiesSchema = new EntitySchema({
  name: 'Abilities',
  tableName: 'abilities',
  columns: {
    id: { type: Number, primary: true },
    name: { type: String },
    generation_introduced: { type: String },
    description: { type: String, nullable: true },
    short_description: { type: String, nullable: true }
  }
})

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [AbilitiesSchema],
  synchronize: false
})

function readCsv(filePath: string): Promise<AbilitiesCsvRow[]> {
  return new Promise((resolve, reject) => {
    const records: AbilitiesCsvRow[] = []

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => records.push(row as AbilitiesCsvRow))
      .on('end', () => resolve(records))
      .on('error', reject)
  })
}

async function run() {
  await dataSource.initialize()

  try {
    const dadosCsv = await readCsv('./database/pokemon_za/abilities.csv')
    const abilitiesRepository = dataSource.getRepository(AbilitiesSchema)

    const abilities = dadosCsv.map((row) => ({
      id: Number(row.id),
      name: row.name,
      generation_introduced: row.generation_introduced,
      description: row.description || null,
      short_description: row.short_description || null
    }))

    await abilitiesRepository.save(abilities)

    console.log('✅ Importação concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante importação:', error)
  } finally {
    await dataSource.destroy()
  }
}

run()
