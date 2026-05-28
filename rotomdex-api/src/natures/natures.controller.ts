import { Controller, Get, Param, Query } from '@nestjs/common';
import { NaturesService } from './natures.service';
import { NatureQueryDto } from './dto/nature-query.dto';

@Controller('natures')
export class NaturesController {
  constructor(private readonly naturesService: NaturesService) {}

  @Get()
  findAll(@Query() query: NatureQueryDto) {
    return this.naturesService.findAll(query);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.naturesService.findOne(name);
  }

}
