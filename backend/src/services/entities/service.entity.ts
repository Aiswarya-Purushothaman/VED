import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ServicePackage } from './service-package.entity';
import { ServiceAddon } from './service-addon.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 10, nullable: true })
  emoji: string;

  @Column({ length: 300 })
  shortDesc: string;

  @Column({ type: 'text' })
  longDesc: string;

  @Column({ length: 500 })
  image: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'jsonb', default: [] })
  included: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ServicePackage, (pkg) => pkg.service, { cascade: true })
  packages: ServicePackage[];

  @OneToMany(() => ServiceAddon, (addon) => addon.service, { cascade: true })
  addons: ServiceAddon[];
}
