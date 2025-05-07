import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';

@Entity('publication')
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  contenu: string;

  @ManyToOne(() => User, (user) => user.publications, { onDelete: 'CASCADE' })
  auteur: User;

  @OneToMany(() => Tag, (tag) => tag.publication, { cascade: true })
  tags: Tag[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;
}
