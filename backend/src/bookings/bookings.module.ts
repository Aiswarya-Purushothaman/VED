import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingReminderService } from './booking-reminder.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), NotificationsModule],
  providers: [BookingsService, BookingReminderService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
