import { Injectable } from '@nestjs/common';
import { ItemsQueryDto } from './dto/item-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  findAll() {
    return this.itemsRepository.find();
  }

  findFiltered(query: ItemsQueryDto) {
    const qb = this.itemsRepository.createQueryBuilder('item');

    if (query.cost_min !== undefined && query.cost_max !== undefined) {
      qb.andWhere('item.cost BETWEEN :cost_min AND :cost_max', {
        cost_min: query.cost_min,
        cost_max: query.cost_max,
      });
    } else if (query.cost_min !== undefined) {
      qb.andWhere('item.cost >= :cost_min', { cost_min: query.cost_min });
    } else if (query.cost_max !== undefined) {
      qb.andWhere('item.cost <= :cost_max', { cost_max: query.cost_max });
    } else if (query.cost !== undefined) {
      qb.andWhere('item.cost = :cost', { cost: query.cost });
    }

    if (query.fling_power !== undefined) {
      qb.andWhere('item.fling_power = :fling_power', {
        fling_power: query.fling_power,
      });
    }

    if (query.category !== undefined) {
      qb.andWhere('item.category = :category', { category: query.category });
    }

    if (query.description !== undefined) {
      qb.andWhere('item.description ILIKE :description', {
        description: `%${query.description}%`,
      });
    }

    if (query.orderBy !== undefined) {
      const order = query.order || 'ASC';
      qb.orderBy(`item.${query.orderBy}`, order);
    }

    return qb.getMany();
  }

  findOne(name: string) {
    name = name.replace(/ /g, '-');
    return this.itemsRepository.findBy({ name: ILike(`%${name}%`) }) ;
  }
}
