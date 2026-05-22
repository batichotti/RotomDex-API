import { Controller, Get, Query } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypeQueryDto as TypeOfensiveQueryDto } from './dtos/type-ofensive-query.dto';
import { TypeQueryDto as TypeDefensiveQueryDto } from './dtos/type-defensive-query.dto copy';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Get('/ofensive')
  find_ofensive(
    @Query() query: TypeOfensiveQueryDto,
  ){
    return this.typesService.findOfensive(query);
  }

  @Get('/defensive')
  find_defensive(
    @Query() query: TypeDefensiveQueryDto,
  ){
    return this.typesService.findDefensive(query);
  }
}
