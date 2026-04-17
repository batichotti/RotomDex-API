import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numeral!: number;

  @Column({ length: 100 })
  name!: string;

  @Column()
  species_id!: number;

  @Column( { length: 20 } )
  primary_type!: string;

  @Column( { length: 20 } )
  secondary_type?: string;

  @Column({ type: 'smallint' })
  hp!: number;

  @Column({ type: 'smallint' })
  attack!: number;

  @Column({ type: 'smallint' })
  defense!: number;

  @Column({ type: 'smallint' })
  special_attack!: number;

  @Column({ type: 'smallint' })
  special_defense!: number;

  @Column({ type: 'smallint' })
  speed!: number;
  
  @Column({ type: 'smallint' })
  bst!: number;

  @Column()
  height!: number;

  @Column()
  weight!: number;

  @Column({ type: 'numeric', precision: 6, scale: 1, nullable: true })
  base_experience?: number;
}