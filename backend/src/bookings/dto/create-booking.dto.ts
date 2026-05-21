import {
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateBookingDto {
  @IsString() serviceId: string;
  @IsOptional() @IsString() packageId?: string;
  @IsString() customerName: string;
  @IsString() customerPhone: string;
  @IsEmail() customerEmail: string;
  @IsDateString() eventDate: string;
  @IsString() venue: string;
  @IsOptional() @IsArray() requestedAddons?: string[];
  @IsOptional() @IsString() specialNotes?: string;
}
