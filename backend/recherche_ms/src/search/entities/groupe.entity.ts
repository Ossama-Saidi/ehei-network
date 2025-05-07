import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Search } from './search.entity';
import { Tag } from './tag.entity';

@Entity('groupe')
export class Groupe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  date_creation: Date;

  @OneToMany(() => Search, search => search.groupe) // Correction ici
  recherches: Search[];

  @OneToMany(() => Tag, tag => tag.groupe)
  tags: Tag[];
}