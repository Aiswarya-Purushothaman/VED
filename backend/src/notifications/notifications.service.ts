import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { NotificationsGateway } from './notifications.gateway';

export interface CustomerUpdateData {
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  changedField: 'status' | 'quotedPrice' | 'both';
  newStatus?: string;
  newPrice?: number;
}

export interface BookingNotificationData {
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  packageName: string | null;
  eventDate: string;
  venue: string;
  requestedAddons: string[];
  specialNotes: string | null;
}

export interface PendingReminderItem {
  bookingNumber: string;
  customerName: string;
  serviceName: string;
  eventDate: string;
  status: string;
}

export interface PendingReminderData {
  pendingCount: number;
  inProgressCount: number;
  bookings: PendingReminderItem[];
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly twilioClient: twilio.Twilio | null;
  private readonly adminPhone: string | undefined;
  private readonly fromPhone: string | undefined;

  constructor(
    private readonly gateway: NotificationsGateway,
    private readonly config: ConfigService,
  ) {
    const sid = config.get<string>('TWILIO_ACCOUNT_SID');
    const token = config.get<string>('TWILIO_AUTH_TOKEN');
    this.adminPhone = config.get<string>('ADMIN_PHONE_NUMBER');
    this.fromPhone = config.get<string>('TWILIO_FROM_NUMBER');

    this.twilioClient = sid && token ? twilio(sid, token) : null;
  }

  async notifyAdminNewBooking(data: BookingNotificationData): Promise<void> {
    this.logger.log(
      `New booking ${data.bookingNumber} — ${data.customerName} | ${data.serviceName} on ${data.eventDate}`,
    );

    // 1. Real-time web toast via Socket.IO
    this.gateway.emitNewBooking(data);

    // 2. SMS to admin phone via Twilio
    if (this.twilioClient && this.adminPhone && this.fromPhone) {
      const body =
        `📅 New VED Booking!\n` +
        `#${data.bookingNumber}\n` +
        `Customer: ${data.customerName} (${data.customerPhone})\n` +
        `Service: ${data.serviceName}${data.packageName ? ' – ' + data.packageName : ''}\n` +
        `Date: ${data.eventDate}\n` +
        `Venue: ${data.venue}`;

      this.twilioClient.messages
        .create({ body, from: this.fromPhone, to: this.adminPhone })
        .then((msg) => this.logger.log(`SMS sent: ${msg.sid}`))
        .catch((err) => this.logger.error(`SMS failed: ${err.message}`));
    } else {
      this.logger.warn('Twilio not configured — skipping SMS');
    }
  }

  async notifyCustomerUpdate(data: CustomerUpdateData): Promise<void> {
    this.logger.log(
      `Customer update — ${data.bookingNumber} | ${data.changedField}`,
    );

    if (!this.twilioClient || !this.fromPhone) {
      this.logger.warn('Twilio not configured — skipping customer SMS');
      return;
    }

    const trackUrl = `${this.config.get<string>('FRONTEND_URL') ?? 'https://ved.in'}/bookings/track/${data.bookingNumber}`;
    const lines: string[] = [`Hi ${data.customerName}!`];

    if (data.changedField === 'status' || data.changedField === 'both') {
      const label = (data.newStatus ?? '').replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      lines.push(`Your VED booking #${data.bookingNumber} status is now: ${label}.`);
    }

    if (data.changedField === 'quotedPrice' || data.changedField === 'both') {
      const formatted = Number(data.newPrice).toLocaleString('en-IN');
      lines.push(`Your booking has been quoted at ₹${formatted}.`);
    }

    lines.push(`Track here: ${trackUrl}`);

    const body = lines.join('\n');

    this.twilioClient.messages
      .create({ body, from: this.fromPhone, to: data.customerPhone })
      .then((msg) => this.logger.log(`Customer SMS sent: ${msg.sid}`))
      .catch((err) => this.logger.error(`Customer SMS failed: ${err.message}`));
  }

  async notifyAdminPendingBookings(data: PendingReminderData): Promise<void> {
    this.logger.log(
      `6h reminder — ${data.pendingCount} pending, ${data.inProgressCount} in_progress`,
    );

    this.gateway.emitPendingReminder(data);

    if (this.twilioClient && this.adminPhone && this.fromPhone) {
      const lines: string[] = [`⏰ VED Reminder (${data.pendingCount + data.inProgressCount} need attention)`];
      if (data.pendingCount) lines.push(`⏳ Pending: ${data.pendingCount}`);
      if (data.inProgressCount) lines.push(`🔄 In Progress: ${data.inProgressCount}`);
      const body = lines.join('\n');

      this.twilioClient.messages
        .create({ body, from: this.fromPhone, to: this.adminPhone })
        .then((msg) => this.logger.log(`Reminder SMS sent: ${msg.sid}`))
        .catch((err) => this.logger.error(`Reminder SMS failed: ${err.message}`));
    }
  }
}
