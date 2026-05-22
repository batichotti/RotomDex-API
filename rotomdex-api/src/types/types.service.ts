import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './entities/type.entity'
import { Repository } from 'typeorm';
import { TypeQueryDto as TypeOfensiveQueryDto } from './dtos/type-ofensive-query.dto';
import { TypeQueryDto as TypeDefensiveQueryDto } from './dtos/type-defensive-query.dto copy';

@Injectable()
export class TypesService {
    constructor(
        @InjectRepository(Type)
        private typesRepository: Repository<Type>,
    ) {}

    findOfensive( query: TypeOfensiveQueryDto){
        return query.type;
    }

    findDefensive(query: TypeDefensiveQueryDto){
        return `${query.type} - ${query.type2}`;
    }
}
