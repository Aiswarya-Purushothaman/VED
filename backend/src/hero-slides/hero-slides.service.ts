import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroSlide } from './entities/hero-slide.entity';

export interface UpsertHeroSlideDto {
  tag: string;
  title: string;
  titleAccent: string;
  subtitle1: string;
  subtitle2: string;
  image: string;
  color: string;
  accentColor: string;
  bg: string;
  sortOrder?: number;
  isActive?: boolean;
}

@Injectable()
export class HeroSlidesService {
  constructor(
    @InjectRepository(HeroSlide)
    private readonly repo: Repository<HeroSlide>,
  ) {}

  findAll(): Promise<HeroSlide[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  findAllAdmin(): Promise<HeroSlide[]> {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  async create(dto: UpsertHeroSlideDto): Promise<HeroSlide> {
    const slide = this.repo.create(dto);
    return this.repo.save(slide);
  }

  async update(id: string, dto: Partial<UpsertHeroSlideDto>): Promise<HeroSlide> {
    const slide = await this.repo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Hero slide not found');
    Object.assign(slide, dto);
    return this.repo.save(slide);
  }

  async remove(id: string): Promise<void> {
    const slide = await this.repo.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Hero slide not found');
    await this.repo.delete(id);
  }

  async seed(slides: UpsertHeroSlideDto[]): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save(slides.map((s) => this.repo.create(s)));
  }
}
