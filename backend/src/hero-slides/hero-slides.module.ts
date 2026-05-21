import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroSlide } from './entities/hero-slide.entity';
import { HeroSlidesService } from './hero-slides.service';
import { HeroSlidesController } from './hero-slides.controller';

const DEFAULT_SLIDES = [
  {
    tag: 'C R A F T I N G',
    title: 'Beautiful Moments',
    titleAccent: 'That Last Forever',
    subtitle1: 'PRE-WEDDING • ENGAGEMENT • BIRTHDAY',
    subtitle2: 'ANNIVERSARY • BABY SHOWER • AND MORE',
    image: '/hero-wedding-mandap.png',
    color: '#b87a6c',
    accentColor: '#5c674b',
    bg: '#fcf6ef',
    sortOrder: 0,
  },
  {
    tag: 'C R A F T I N G',
    title: 'Unforgettable',
    titleAccent: 'Birthday Magic',
    subtitle1: 'MILESTONES • SURPRISES • KIDS PARTIES',
    subtitle2: 'THEME DECOR • BALLOON ARCHES • AND MORE',
    image: '/hero-birthday-luxury.png',
    color: '#b87a6c',
    accentColor: '#5c674b',
    bg: '#fceba7',
    sortOrder: 1,
  },
  {
    tag: 'C R A F T I N G',
    title: 'Romantic Dinners',
    titleAccent: 'Just For You',
    subtitle1: 'CANDLELIGHT • PRIVATE CABANAS • ROOFTOP',
    subtitle2: 'ANNIVERSARY • PROPOSAL • AND MORE',
    image: '/hero-romantic-dinner.png',
    color: '#b87a6c',
    accentColor: '#5c674b',
    bg: '#a4d1f6ff',
    sortOrder: 2,
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([HeroSlide])],
  providers: [HeroSlidesService],
  controllers: [HeroSlidesController],
  exports: [HeroSlidesService],
})
export class HeroSlidesModule implements OnModuleInit {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  async onModuleInit() {
    await this.heroSlidesService.seed(DEFAULT_SLIDES);
  }
}
