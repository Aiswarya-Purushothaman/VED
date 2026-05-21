import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Service } from './service.entity';

@Entity('service_addons')
export class ServiceAddon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, (service) => service.addons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: string;

  @Column({ length: 150 })
  name: string;
}
