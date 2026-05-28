import { Injectable } from '@nestjs/common';

@Injectable()
export class NaturesService {
  
  findAll() {
    return `This action returns all natures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nature`;
  }
}
