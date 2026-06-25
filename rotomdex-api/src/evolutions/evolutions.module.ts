import { Module } from '@nestjs/common';
import { EvolutionsService } from './evolutions.service';
import { EvolutionsController } from './evolutions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evolution } from './entities/evolution.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Evolution])],
  controllers: [EvolutionsController],
  providers: [EvolutionsService],
})
export class EvolutionsModule {}
