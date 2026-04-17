import { Module } from '@nestjs/common';
import { MovesService } from './moves.service';
import { MovesController } from './moves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moves } from './moves.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Moves])],
  controllers: [MovesController],
  providers: [MovesService],
})
export class MovesModule {}
