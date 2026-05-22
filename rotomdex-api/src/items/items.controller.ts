import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsQueryDto } from './dto/item-query.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() query: ItemsQueryDto) {
    return this.itemsService.findFiltered(query);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.itemsService.findOne(name);
  }
}
