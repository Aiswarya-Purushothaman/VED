import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateGalleryImageDto {
  @IsString() src: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() alt?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() sortOrder?: number;
}
