import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Moves {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  accuracy!: number;

  @Column({ nullable: true })
  power!: number;

  @Column()
  type!: string;

  @Column()
  pp!: number;

  @Column({ nullable: true })
  effect_chance!: number;

  @Column({ default: 0 })
  priority!: number;

  @Column()
  damage_class!: string;

  @Column()
  generation_introduced!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  short_description!: string;

  @Column({ nullable: true })
  category!: string;

}