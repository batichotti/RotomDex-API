import fs from 'fs'
import 'dotenv/config'
import 'reflect-metadata'
import { parse } from 'csv-parse'
import { DataSource, EntitySchema } from 'typeorm'

type PokemonAbilityCsvRow = {
	pokemon_id: string
	pokemon_name: string
	ability_name: string
	ability_id: string
	ability_slot: string
	is_hidden: string
}

type PokemonAbility = {
	pokemon_id: number
	pokemon_name: string
	ability_name: string
	ability_id: number
	ability_slot: number
	is_hidden: boolean
}

const PokemonAbilitySchema = new EntitySchema<PokemonAbility>({
	name: 'PokemonAbility',
	tableName: 'pokemon_abilities',
	columns: {
		pokemon_id: { type: Number, primary: true },
		pokemon_name: { type: String },
		ability_name: { type: String },
		ability_id: { type: Number, primary: true },
		ability_slot: { type: Number },
		is_hidden: { type: Boolean }
	}
})

const dataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	entities: [PokemonAbilitySchema],
	synchronize: false
})

function readCsv(filePath: string): Promise<PokemonAbilityCsvRow[]> {
	return new Promise((resolve, reject) => {
		const records: PokemonAbilityCsvRow[] = []

		fs.createReadStream(filePath)
			.pipe(parse({ columns: true, trim: true }))
			.on('data', (row) => records.push(row as PokemonAbilityCsvRow))
			.on('end', () => resolve(records))
			.on('error', reject)
	})
}

function toBoolean(value: string): boolean {
	return value.trim().toLowerCase() === 'true'
}

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
		const dadosCsv = await readCsv('./database/pokemon_za/pokemon_abilities.csv')
		const pokemonAbilityRepository = dataSource.getRepository(PokemonAbilitySchema)

		const pokemonAbilities: PokemonAbility[] = dadosCsv.map((row) => ({
			pokemon_id: Number(row.pokemon_id),
			pokemon_name: row.pokemon_name,
			ability_name: row.ability_name,
			ability_id: Number(row.ability_id),
			ability_slot: Number(row.ability_slot),
			is_hidden: toBoolean(row.is_hidden)
		}))

		const lotes = chunk(pokemonAbilities, 500)

		for (const lote of lotes) {
			await pokemonAbilityRepository.save(lote)
		}

		console.log(`✅ Importação da relação pokemon-habilidades concluída! (${pokemonAbilities.length} registros)`)
	} catch (error) {
		console.error('❌ Erro durante importação:', error)
	} finally {
		await dataSource.destroy()
	}
}

run()
