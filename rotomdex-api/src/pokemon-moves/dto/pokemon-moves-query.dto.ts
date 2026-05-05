import { IsOptional, IsIn, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const MOVES_ATTRIBUTES = ['id', 'name', 'power', 'type', 'pp', 'effect_chance', 'damage_class', 'category', ]
const MOVES_ATTRIBUTES_TO_FILL = [ 'power', 'pp', 'effect_chance' ]
const MOVES_TYPES = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'] as const;
const MOVES_DAMAGE_CLASS = ['physical', 'special', 'status']
const MOVES_CATEGORY = ['punching', 'dance', 'slicing', 'wind', 'biting', 'sound-based', 'powder and spore', 'explosive', 'ball and bomb', 'aura and pulse', 'damaging z-move', 'max']
const MOVES_GENERATION = ['generation-i', 'generation-ii', 'generation-iii', 'generation-iv', 'generation-v', 'generation-vi', 'generation-vii', 'generation-viii', 'generation-ix']
const LEARN_METHOD = ['level-up', 'egg', 'machine', 'tutor']
export class PokemonMovesDto{
    @ApiPropertyOptional({ enum: LEARN_METHOD})
    @IsOptional()
    @IsIn([...LEARN_METHOD], { message: `Learn Method must be one of: ${LEARN_METHOD.join(', ')}`})
    learn_method?: string;
}