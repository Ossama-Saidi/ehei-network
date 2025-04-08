import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Groupe } from './groupe.entity';
import { Publication } from './publication.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nom: string;

  @Column({ default: 0 })
  occurrences: number;

  @Column('simple-array', { nullable: true })
  variations?: string[];

  // Remplacement de jsonb par text + conversion manuelle
  @Column({ type: 'text', nullable: true })
  metadata?: string; // Stockage en JSON stringifié

  @Column({ type: 'datetime', nullable: true })
  lastUsedDate: Date;

  @Column({ default: false })
  isTrending: boolean;

  @ManyToOne(() => Groupe, (groupe) => groupe.tags, { onDelete: 'CASCADE', nullable: true })
  groupe: Groupe;

  @ManyToOne(() => Publication, (publication) => publication.tags, { onDelete: 'CASCADE', nullable: true })
  publication: Publication;

  // Méthodes d'aide pour metadata
  getMetadataObject(): Record<string, any> {
    return this.metadata ? JSON.parse(this.metadata) : {};
  }

  setMetadataObject(data: Record<string, any>) {
    this.metadata = JSON.stringify(data);
  }
}