import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
  ) {}

  create(dto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepo.create({ ...dto, isApproved: false });
    return this.reviewRepo.save(review);
  }

  findApproved(): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { isApproved: true },
      order: { createdAt: 'DESC' },
    });
  }

  findAll(): Promise<Review[]> {
    return this.reviewRepo.find({ order: { createdAt: 'DESC' } });
  }

  async approve(id: string): Promise<Review> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    review.isApproved = true;
    return this.reviewRepo.save(review);
  }

  async reject(id: string): Promise<void> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    await this.reviewRepo.delete(id);
  }
}
