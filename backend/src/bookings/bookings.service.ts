import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateBookingDto, userId: string): Promise<Booking> {
    const booking = this.bookingRepo.create({
      serviceId: dto.serviceId,
      packageId: dto.packageId ?? null,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail,
      eventDate: dto.eventDate,
      venue: dto.venue,
      requestedAddons: dto.requestedAddons ?? [],
      specialNotes: dto.specialNotes ?? null,
      userId,
    });
    const saved = await this.bookingRepo.save(booking);

    // Reload with relations so we have service/package names for notifications
    const full = await this.bookingRepo.findOne({
      where: { id: saved.id },
      relations: ['service', 'package'],
    });

    if (full) {
      this.notifications.notifyAdminNewBooking({
        bookingNumber: full.bookingNumber,
        customerName: full.customerName,
        customerPhone: full.customerPhone,
        customerEmail: full.customerEmail,
        serviceName: full.service?.name ?? '',
        packageName: full.package?.name ?? null,
        eventDate: full.eventDate,
        venue: full.venue,
        requestedAddons: full.requestedAddons,
        specialNotes: full.specialNotes,
      }).catch(() => {}); // fire-and-forget — never block the response
    }

    return saved;
  }

  findAll(status?: BookingStatus): Promise<Booking[]> {
    const where: any = {};
    if (status) where.status = status;
    return this.bookingRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByBookingNumber(bookingNumber: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { bookingNumber },
      relations: ['user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  findByUserId(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    const statusChanged = dto.status !== undefined && dto.status !== booking.status;
    const priceChanged = dto.quotedPrice !== undefined && dto.quotedPrice !== booking.quotedPrice;

    Object.assign(booking, dto);
    const saved = await this.bookingRepo.save(booking);

    if (statusChanged || priceChanged) {
      const changedField = statusChanged && priceChanged ? 'both' : statusChanged ? 'status' : 'quotedPrice';
      this.notifications.notifyCustomerUpdate({
        bookingNumber: saved.bookingNumber,
        customerName: saved.customerName,
        customerPhone: saved.customerPhone,
        changedField,
        ...(statusChanged ? { newStatus: saved.status } : {}),
        ...(priceChanged ? { newPrice: Number(saved.quotedPrice) } : {}),
      }).catch(() => {});
    }

    return saved;
  }

  async getStats() {
    const total = await this.bookingRepo.count();
    const pending = await this.bookingRepo.count({ where: { status: BookingStatus.PENDING } });
    const confirmed = await this.bookingRepo.count({ where: { status: BookingStatus.CONFIRMED } });
    const completed = await this.bookingRepo.count({ where: { status: BookingStatus.COMPLETED } });
    return { total, pending, confirmed, completed };
  }
}
