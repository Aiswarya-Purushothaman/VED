import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class UpdateBookingDto {
  @IsOptional() @IsEnum(BookingStatus) status?: BookingStatus;
  @IsOptional() @IsNumber() quotedPrice?: number;
  @IsOptional() @IsString() adminNotes?: string;
}
