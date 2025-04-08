import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Search } from './search.entity';
import { Publication } from './publication.entity'; // Ajout de l'import

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Search, (search) => search.utilisateur)
  recherches: Search[];

  @OneToMany(() => Publication, (publication) => publication.auteur)
  publications: Publication[];
}