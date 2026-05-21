import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { ServicePackage } from '../services/entities/service-package.entity';
import { ServiceAddon } from '../services/entities/service-addon.entity';
import { GalleryImage } from '../gallery/entities/gallery-image.entity';
import { Review } from '../reviews/entities/review.entity';
import { Booking } from '../bookings/entities/booking.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  entities: [User, Service, ServicePackage, ServiceAddon, GalleryImage, Review, Booking],
  logging: false,
});

// Exact images from frontend/src/data/services.ts
const IMAGE_MAP: Record<string, string> = {
  'birthday-decorations':   '/services/service_birthday.png',
  'wedding-decorations':    '/services/service_wedding.png',
  'anniversary-decorations':'/services/service_anniversary.png',
  'baby-shower':            '/services/service_babyshower.png',
  'corporate-events':       '/services/service_corporate.png',
  'candlelight-dinner':     '/services/service_candlelight.png',
  'premium-luxury-decor':   '/services/service_premium.png',
  'proposal-setup':         '/services/service_proposal.png',
  'kids-birthday-party':    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'engagement-ceremony':    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
  'bachelorette-party':     'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&q=80',
  'welcome-baby':           'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
  'mehndi-ceremony':        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
  'haldi-ceremony':         'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
  'reception-decor':        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
  'sangeet-night':          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
  'gender-reveal-party':    'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80',
  'graduation-celebration': 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80',
  'farewell-party':         'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80',
  'retirement-party':       'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  'first-birthday':         'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
  'milestone-birthday':     'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
  'surprise-birthday':      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
  'princess-theme-party':   'https://images.unsplash.com/photo-1550159930-40066082a4fc?w=800&q=80',
  'unicorn-theme-party':    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
  'outdoor-party':          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
  'festival-decorations':   'https://images.unsplash.com/photo-1514222788835-3a1a1d5b32f8?w=800&q=80',
  'diwali-decoration':      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80',
  'christmas-new-year':     'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80',
  'house-warming':          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'naming-ceremony':        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80',
  'bridal-suite-decoration':'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
  'balloon-sculpture-art':  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80',
  'floral-wall-installation':'https://images.unsplash.com/photo-1487530811015-780dba7a71cf?w=800&q=80',
  'led-lighting-setup':     'https://images.unsplash.com/photo-1501386761578-eaa54b1f1b34?w=800&q=80',
  'photo-booth-setup':      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  'pool-party-decoration':  'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80',
  'kitty-party-setup':      'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80',
  'virtual-events':         'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80',
  'product-launch-event':   'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80',
  'award-ceremony':         'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80',
  'customised-decor':       'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80',
};

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Service);

  let updated = 0;
  for (const [slug, image] of Object.entries(IMAGE_MAP)) {
    const result = await repo.update({ slug }, { image });
    if (result.affected) updated++;
  }

  console.log(`✓ Updated images for ${updated} services`);
  await AppDataSource.destroy();
}

run().catch((err) => { console.error(err); process.exit(1); });
