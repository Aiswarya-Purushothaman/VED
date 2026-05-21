import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Service } from './service.entity';

export enum PlanType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  LUXURY = 'luxury',
}

@Entity('service_packages')
export class ServicePackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, (service) => service.packages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: string;

  @Column({ type: 'enum', enum: PlanType })
  planType: PlanType;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 300 })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  items: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null;
}
