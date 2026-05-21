import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hero_slides')
export class HeroSlide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  tag: string;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 150 })
  titleAccent: string;

  @Column({ length: 200 })
  subtitle1: string;

  @Column({ length: 200 })
  subtitle2: string;

  @Column({ length: 500 })
  image: string;

  @Column({ length: 20 })
  color: string;

  @Column({ length: 20 })
  accentColor: string;

  @Column({ length: 20 })
  bg: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
