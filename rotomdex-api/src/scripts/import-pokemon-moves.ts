import fs from 'fs'
import 'dotenv/config'
import 'reflect-metadata'
import { parse } from 'csv-parse'
import { DataSource, EntitySchema } from 'typeorm'

type PokemonMoveCsvRow = {
  pokemon_id: string
  pokemon_name: string
  move_name: string
  move_id: string
  level_learned_at: string
  move_learn_method: string
  most_recent_game_learned_in: string
}

type PokemonMove = {
  pokemon_id: number
  pokemon_name: string
  move_name: string
  move_id: number
  level_learned_at: number | null
  move_learn_method: string
  most_recent_game_learned_in: string
}

const PokemonMoveSchema = new EntitySchema<PokemonMove>({
  name: 'PokemonMove',
  tableName: 'pokemon_moves',
  columns: {
    pokemon_id: { type: Number, primary: true },
    pokemon_name: { type: String },
    move_name: { type: String },
    move_id: { type: Number, primary: true },
    level_learned_at: { type: Number, nullable: true },
    move_learn_method: { type: String },
    most_recent_game_learned_in: { type: String }
  }
})

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [PokemonMoveSchema],
  synchronize: false
})

function readCsv(filePath: string): Promise<PokemonMoveCsvRow[]> {
  return new Promise((resolve, reject) => {
    const records: PokemonMoveCsvRow[] = []

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => records.push(row as PokemonMoveCsvRow))
      .on('end', () => resolve(records))
      .on('error', reject)
  })
}

function toNullableNumber(value: string): number | null {
  const normalized = value.trim()
  return normalized === '' ? null : Number(normalized)
}

// Divide um array em pedaços de tamanho `size`
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

async function run() {
  await dataSource.initialize()

  try {
    const dadosCsv = await readCsv('./database/pokemon_za/pokemon_moves.csv')
    const pokemonMoveRepository = dataSource.getRepository(PokemonMoveSchema)

    const pokemonMoves: PokemonMove[] = dadosCsv.map((row) => ({
      pokemon_id: Number(row.pokemon_id),
      pokemon_name: row.pokemon_name,
      move_name: row.move_name,
      move_id: Number(row.move_id),
      level_learned_at: toNullableNumber(row.level_learned_at),
      move_learn_method: row.move_learn_method,
      most_recent_game_learned_in: row.most_recent_game_learned_in
    }))

    // Upsert em lotes de 500 para evitar queries gigantes
    const lotes = chunk(pokemonMoves, 500)

    for (const lote of lotes) {
      // Use save instead of upsert because the DB doesn't have a unique
      // constraint matching the ON CONFLICT target (composite key). save()
      // will perform proper insert/update based on entity primary columns.
      await pokemonMoveRepository.save(lote)
    }

    console.log(`✅ Importação de movimentos concluída! (${pokemonMoves.length} registros)`)
  } catch (error) {
    console.error('❌ Erro durante importação:', error)
  } finally {
    await dataSource.destroy()
  }
}

run()