import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  customerName: string;

  @Column({ nullable: true, length: 255 })
  customerEmail: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  reviewText: string;

  @Column({ nullable: true, length: 100 })
  serviceSlug: string;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
