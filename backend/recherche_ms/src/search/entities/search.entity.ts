import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Groupe } from './groupe.entity';
import { Tag } from './tag.entity';

@Entity('recherche')
export class Search {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recherches, { nullable: true, onDelete: 'CASCADE' })
  utilisateur: User;

  @Column()
  terme: string;

  @Column({
    type: 'enum',
    enum: ['utilisateur', 'groupe', 'tag', 'publication'],
    nullable: true,
  })
  type: 'utilisateur' | 'groupe' | 'tag' | 'publication' | null;

  @Column({ type: 'int', nullable: true })
  resultat_id: number | null;

  @ManyToOne(() => Groupe, { nullable: true, onDelete: 'SET NULL' })
  groupe: Groupe;

  @ManyToOne(() => Tag, { nullable: true, onDelete: 'SET NULL' })
  tag: Tag;

  @Column({ type: 'enum', enum: ['trouvé', 'non trouvé'], default: 'trouvé' })
  statut: 'trouvé' | 'non trouvé';

  @CreateDateColumn()
  date_recherche: Date;
}
