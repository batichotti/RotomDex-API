import fs from 'fs'
import 'dotenv/config'
import 'reflect-metadata'
import { parse } from 'csv-parse'
import { DataSource, EntitySchema } from 'typeorm'

type MovesCsvRow = {
  id: string
  name: string
  accuracy?: string
  power?: string
  type: string
  pp: string
  effect_chance?: string
  priority: string
  damage_class: string
  generation_introduced: string
  description?: string
  short_description?: string
  category?: string
}

const MovesSchema = new EntitySchema({
  name: 'Moves',
  tableName: 'moves',
  columns: {
    id: { type: Number, primary: true },
    name: { type: String },
    accuracy: { type: Number, nullable: true },
    power: { type: Number, nullable: true },
    type: { type: String },
    pp: { type: Number },
    effect_chance: { type: Number, nullable: true },
    priority: { type: Number },
    damage_class: { type: String },
    generation_introduced: { type: String },
    description: { type: String, nullable: true },
    short_description: { type: String, nullable: true },
    category: { type: String, nullable: true }
  }
})

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [MovesSchema],
  synchronize: false
})

function readCsv(filePath: string): Promise<MovesCsvRow[]> {
  return new Promise((resolve, reject) => {
    const records: MovesCsvRow[] = []

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => records.push(row as MovesCsvRow))
      .on('end', () => resolve(records))
      .on('error', reject)
  })
}

async function run() {
  await dataSource.initialize()

  try {
    const dadosCsv = await readCsv('./database/pokemon_za/moves.csv')
    const movesRepository = dataSource.getRepository(MovesSchema)

    const moves = dadosCsv.map((row) => ({
      id: Number(row.id),
      name: row.name,
      accuracy: row.accuracy ? Number(row.accuracy) : null,
      power: row.power ? Number(row.power) : null,
      type: row.type,
      pp: Number(row.pp),
      effect_chance: row.effect_chance ? Number(row.effect_chance) : null,
      priority: Number(row.priority),
      damage_class: row.damage_class,
      generation_introduced: row.generation_introduced,
      description: row.description || null,
      short_description: row.short_description || null,
      category: row.category || null
    }))

    await movesRepository.save(moves)

    console.log('✅ Importação concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante importação:', error)
  } finally {
    await dataSource.destroy()
  }
}

run()
