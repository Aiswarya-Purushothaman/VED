import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServicePackage, PlanType } from './entities/service-package.entity';
import { ServiceAddon } from './entities/service-addon.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
    @InjectRepository(ServicePackage) private readonly packageRepo: Repository<ServicePackage>,
    @InjectRepository(ServiceAddon) private readonly addonRepo: Repository<ServiceAddon>,
  ) {}

  findAll(category?: string): Promise<Service[]> {
    const where: any = { isActive: true };
    if (category) where.category = category;
    return this.serviceRepo.find({ where, order: { sortOrder: 'ASC', name: 'ASC' } });
  }

  findAllAdmin(): Promise<Service[]> {
    return this.serviceRepo.find({
      relations: ['packages', 'addons'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<Service> {
    const service = await this.serviceRepo.findOne({
      where: { slug },
      relations: ['packages', 'addons'],
    });
    if (!service) throw new NotFoundException(`Service '${slug}' not found`);
    return service;
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['packages', 'addons'],
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async create(dto: CreateServiceDto): Promise<Service> {
    const existing = await this.serviceRepo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already exists');

    const service = this.serviceRepo.create({
      slug: dto.slug,
      name: dto.name,
      emoji: dto.emoji,
      shortDesc: dto.shortDesc,
      longDesc: dto.longDesc,
      image: dto.image,
      category: dto.category,
      included: dto.included ?? [],
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
    const saved = await this.serviceRepo.save(service);

    if (dto.packages?.length) {
      const pkgs = dto.packages.map((p) =>
        this.packageRepo.create({
          serviceId: saved.id,
          planType: p.planType as PlanType,
          name: p.name,
          description: p.description,
          items: p.items,
          price: p.price ?? null,
        }),
      );
      await this.packageRepo.save(pkgs);
    }

    if (dto.addons?.length) {
      const addons = dto.addons.map((name) =>
        this.addonRepo.create({ serviceId: saved.id, name }),
      );
      await this.addonRepo.save(addons);
    }

    return this.findById(saved.id);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findById(id);
    const { packages, addons, ...fields } = dto;
    Object.assign(service, fields);
    await this.serviceRepo.save(service);

    if (packages !== undefined) {
      await this.packageRepo.delete({ serviceId: id });
      if (packages.length) {
        const pkgs = packages.map((p) =>
          this.packageRepo.create({
            serviceId: id,
            planType: p.planType as PlanType,
            name: p.name,
            description: p.description,
            items: p.items,
            price: p.price ?? null,
          }),
        );
        await this.packageRepo.save(pkgs);
      }
    }

    if (addons !== undefined) {
      await this.addonRepo.delete({ serviceId: id });
      if (addons.length) {
        const addonEntities = addons.map((name) =>
          this.addonRepo.create({ serviceId: id, name }),
        );
        await this.addonRepo.save(addonEntities);
      }
    }

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.serviceRepo.delete(id);
  }

  async updatePackagePrice(packageId: string, price: number): Promise<ServicePackage> {
    const pkg = await this.packageRepo.findOne({ where: { id: packageId } });
    if (!pkg) throw new NotFoundException('Package not found');
    pkg.price = price;
    return this.packageRepo.save(pkg);
  }
}
