import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column()
  species_id!: number;

  @Column({ length: 100 })
  species_name!: string;

  @Column({ length: 20 })
  generation!: string;

  @Column()
  is_legendary!: boolean;

  @Column()
  is_mythical!: boolean;

  @Column()
  is_baby!: boolean;

  @Column()
  has_gender_differences!: boolean;

  @Column()
  forms_switchable!: boolean;

  @Column()
  is_mega!: boolean;

  @Column()
  is_gmax!: boolean;

  @Column()
  is_regional_form!: boolean;

  @Column({ length: 20, nullable: true })
  egg_group_1?: string;

  @Column({ length: 20, nullable: true })
  egg_group_2?: string;

  @Column({ length: 20 })
  primary_type!: string;

  @Column({ length: 20, nullable: true })
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

  @Column({ type: 'integer' })
  height!: number;

  @Column({ type: 'float' })
  weight!: number;

  @Column({ type: 'numeric', precision: 6, scale: 1 })
  base_experience!: number;
}