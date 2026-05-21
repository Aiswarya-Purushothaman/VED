import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryImage } from './entities/gallery-image.entity';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryImage) private readonly imageRepo: Repository<GalleryImage>,
  ) {}

  findAll(category?: string): Promise<GalleryImage[]> {
    const where: any = { isActive: true };
    if (category) where.category = category;
    return this.imageRepo.find({ where, order: { sortOrder: 'ASC', createdAt: 'DESC' } });
  }

  findAllAdmin(): Promise<GalleryImage[]> {
    return this.imageRepo.find({ order: { sortOrder: 'ASC', createdAt: 'DESC' } });
  }

  create(dto: CreateGalleryImageDto): Promise<GalleryImage> {
    const image = this.imageRepo.create(dto);
    return this.imageRepo.save(image);
  }

  async update(id: string, dto: Partial<CreateGalleryImageDto>): Promise<GalleryImage> {
    const image = await this.imageRepo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    Object.assign(image, dto);
    return this.imageRepo.save(image);
  }

  async remove(id: string): Promise<void> {
    const image = await this.imageRepo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    await this.imageRepo.delete(id);
  }
}
