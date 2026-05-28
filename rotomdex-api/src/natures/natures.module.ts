import { Module } from '@nestjs/common';
import { NaturesService } from './natures.service';
import { NaturesController } from './natures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nature } from './entities/nature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nature])],
  controllers: [NaturesController],
  providers: [NaturesService],
})
export class NaturesModule {}
