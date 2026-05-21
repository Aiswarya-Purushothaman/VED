import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { ServicePackage } from '../../services/entities/service-package.entity';
import { User } from '../../users/entities/user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  bookingNumber: string;

  // optional — set if user is logged in
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: string;

  @ManyToOne(() => ServicePackage, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'packageId' })
  package: ServicePackage;

  @Column({ nullable: true })
  packageId: string;

  @Column({ length: 150 })
  customerName: string;

  @Column({ length: 20 })
  customerPhone: string;

  @Column({ length: 255 })
  customerEmail: string;

  @Column({ type: 'date' })
  eventDate: string;

  @Column({ length: 300 })
  venue: string;

  @Column({ type: 'jsonb', default: [] })
  requestedAddons: string[];

  @Column({ type: 'text', nullable: true })
  specialNotes: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quotedPrice: number | null;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateBookingNumber() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingNumber = `VED-${ts}-${rand}`;
  }
}
