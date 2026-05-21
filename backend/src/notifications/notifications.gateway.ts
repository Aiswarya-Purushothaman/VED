import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { BookingNotificationData, PendingReminderData } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    this.logger.debug(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinAdmin')
  handleJoinAdmin(client: Socket, token: string) {
    try {
      const payload = this.jwtService.verify<{ role: string; sub: string }>(token);
      if (payload.role === 'admin') {
        client.join('admins');
        this.logger.log(`Admin ${payload.sub} joined admins room`);
        return { event: 'joinedAdmin', data: 'ok' };
      }
      client.disconnect();
    } catch {
      client.disconnect();
    }
  }

  emitNewBooking(data: BookingNotificationData) {
    this.server.to('admins').emit('newBooking', data);
  }

  emitPendingReminder(data: PendingReminderData) {
    this.server.to('admins').emit('pendingReminder', data);
  }
}
