import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingReminderService {
  private readonly logger = new Logger(BookingReminderService.name);

  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 0 */3 * * *')
  // @Cron('* * * * *')   // every minute
  async remindAdminOfPendingBookings() {
    const bookings = await this.bookingRepo.find({
      where: [
        { status: BookingStatus.PENDING },
        { status: BookingStatus.IN_PROGRESS },
      ],
      relations: ['service'],
      order: { createdAt: 'ASC' },
    });

    if (bookings.length === 0) {
      this.logger.debug('6h reminder: no pending/in-progress bookings');
      return;
    }

    const pendingCount = bookings.filter((b) => b.status === BookingStatus.PENDING).length;
    const inProgressCount = bookings.filter((b) => b.status === BookingStatus.IN_PROGRESS).length;

    await this.notifications.notifyAdminPendingBookings({
      pendingCount,
      inProgressCount,
      bookings: bookings.map((b) => ({
        bookingNumber: b.bookingNumber,
        customerName: b.customerName,
        serviceName: b.service?.name ?? '',
        eventDate: b.eventDate,
        status: b.status,
      })),
    });
  }
}
