import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GalleryModule } from './gallery/gallery.module';
import { UploadsModule } from './uploads/uploads.module';
import { User } from './users/entities/user.entity';
import { Service } from './services/entities/service.entity';
import { ServicePackage } from './services/entities/service-package.entity';
import { ServiceAddon } from './services/entities/service-addon.entity';
import { Booking } from './bookings/entities/booking.entity';
import { Review } from './reviews/entities/review.entity';
import { GalleryImage } from './gallery/entities/gallery-image.entity';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';
import { HeroSlide } from './hero-slides/entities/hero-slide.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [User, Service, ServicePackage, ServiceAddon, Booking, Review, GalleryImage, HeroSlide],
        synchronize: true,
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    ReviewsModule,
    GalleryModule,
    UploadsModule,
    HeroSlidesModule,
  ],
})
export class AppModule {}
