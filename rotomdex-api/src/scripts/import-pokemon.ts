import fs from 'fs'
import 'dotenv/config'
import 'reflect-metadata'
import { parse } from 'csv-parse'
import { DataSource, EntitySchema } from 'typeorm'

type PokemonCsvRow = {
  id: string
  numeral: string
  name: string
  species_id: string
  primary_type: string
  secondary_type?: string
  hp: string
  attack: string
  defense: string
  special_attack: string
  special_defense: string
  speed: string
  height: string
  weight: string
  base_experience?: string
}

const PokemonSchema = new EntitySchema({
  name: 'Pokemon',
  tableName: 'pokemon',
  columns: {
    id: { type: Number, primary: true },
    numeral: { type: Number },
    name: { type: String },
    species_id: { type: Number },
    primary_type: { type: String },
    secondary_type: { type: String, nullable: true },
    hp: { type: Number },
    attack: { type: Number },
    defense: { type: Number },
    special_attack: { type: Number },
    special_defense: { type: Number },
    speed: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    base_experience: { type: Number }
  }
})

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [PokemonSchema],
  synchronize: false
})

function readCsv(filePath: string): Promise<PokemonCsvRow[]> {
  return new Promise((resolve, reject) => {
    const records: PokemonCsvRow[] = []

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => records.push(row as PokemonCsvRow))
      .on('end', () => resolve(records))
      .on('error', reject)
  })
}

async function run() {
  await dataSource.initialize()

  try {
    const dadosCsv = await readCsv('./database/pokemon_za/pokemon.csv')
    const pokemonRepository = dataSource.getRepository(PokemonSchema)

    const pokemons = dadosCsv.map((row) => ({
      id: Number(row.id),
      numeral: Number(row.numeral),
      name: row.name,
      species_id: Number(row.species_id),
      primary_type: row.primary_type,
      secondary_type: row.secondary_type || null,
      hp: Number(row.hp),
      attack: Number(row.attack),
      defense: Number(row.defense),
      special_attack: Number(row.special_attack),
      special_defense: Number(row.special_defense),
      speed: Number(row.speed),
      height: Number(row.height),
      weight: Number(row.weight),
      base_experience: Number(row.base_experience)
    }))

    await pokemonRepository.save(pokemons)

    console.log('✅ Importação concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante importação:', error)
  } finally {
    await dataSource.destroy()
  }
}

run()