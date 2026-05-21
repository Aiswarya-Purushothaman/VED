import { IsString, IsEmail, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString() customerName: string;
  @IsOptional() @IsEmail() customerEmail?: string;
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsString() reviewText: string;
  @IsOptional() @IsString() serviceSlug?: string;
}
