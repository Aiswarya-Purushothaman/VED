import { IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePackageDto {
  @IsString() planType: string;
  @IsString() name: string;
  @IsString() description: string;
  @IsArray() items: string[];
  @IsOptional() @IsNumber() price?: number;
}

export class CreateServiceDto {
  @IsString() slug: string;
  @IsString() name: string;
  @IsOptional() @IsString() emoji?: string;
  @IsString() shortDesc: string;
  @IsString() longDesc: string;
  @IsString() image: string;
  @IsString() category: string;
  @IsArray() included: string[];
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() sortOrder?: number;
  @IsOptional() @IsArray() packages?: CreatePackageDto[];
  @IsOptional() @IsArray() addons?: string[];
}
