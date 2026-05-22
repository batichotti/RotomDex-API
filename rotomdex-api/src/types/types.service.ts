import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';
import { Repository, ILike } from 'typeorm';
import { TypeQueryDto as TypeOfensiveQueryDto } from './dtos/type-ofensive-query.dto';
import { TypeQueryDto as TypeDefensiveQueryDto } from './dtos/type-defensive-query.dto copy';

@Injectable()
export class TypesService {
    constructor(
        @InjectRepository(Type)
        private typesRepository: Repository<Type>,
    ) {}

    findOfensive( query: TypeOfensiveQueryDto){
        return this.typesRepository.find({ where: { attack_type: ILike(query.type) } });
    }

    findDefensive(query: TypeDefensiveQueryDto){
        if(!query.type2 || query.type == query.type2){
            return this.typesRepository.find({ where: { defense_type: ILike(query.type) } });
        } else {
            return this.typesRepository
                .createQueryBuilder('type')
                .innerJoin(
                    Type,
                    'type2',
                    'type.attack_type = type2.attack_type',
                )
                .select([
                    'type.attack_type AS attack_type',
                    'type.defense_type AS defense_type_1',
                    'type2.defense_type AS defense_type_2',
                    'type.effectiveness AS effectiveness_1',
                    'type2.effectiveness AS effectiveness_2',
                    '(type.effectiveness * type2.effectiveness) AS product',
                ])
                .where('type.defense_type ILIKE :type', { type: query.type })
                .andWhere('type2.defense_type ILIKE :type2', { type2: query.type2 })
                .getRawMany();
        }
    }
}
