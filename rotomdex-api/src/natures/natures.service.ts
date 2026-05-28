import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class NaturesService {
  constructor(
      @InjectRepository(Natures)
      private naturesRepository: Repository<Natures>,
    ) {}

  findAll() {
    return `This action returns all natures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nature`;
  }
}
