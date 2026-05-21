import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User, UserRole } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { ServicePackage, PlanType } from '../services/entities/service-package.entity';
import { ServiceAddon } from '../services/entities/service-addon.entity';
import { GalleryImage } from '../gallery/entities/gallery-image.entity';
import { Review } from '../reviews/entities/review.entity';
import { Booking } from '../bookings/entities/booking.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: true,
  entities: [User, Service, ServicePackage, ServiceAddon, GalleryImage, Review, Booking],
  logging: false,
});

// ── Static service data (from frontend services.ts) ────────────────────────
const SERVICES = [
  {
    slug: 'birthday-decorations', name: 'Birthday Decorations', emoji: '🎂',
    shortDesc: 'Balloon arches, themed setups, surprise decor at home or venue.',
    longDesc: 'Celebrate every birthday with a stunning transformation of your space. Our team crafts personalised balloon arches, themed backdrops, fairy light canopies, and customised name boards to make the birthday person feel truly special.',
    image: '/services/service_birthday.png', category: 'birthday', sortOrder: 1,
    included: ['Balloon arch or cluster', 'Personalised name backdrop', 'Fairy lights & LED string décor', 'Birthday banner or flex board', 'Table centrepieces', 'Welcome board', 'Floor balloon arrangement'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple and sweet birthday setup', items: ['Balloon bouquet', 'Happy Birthday banner', '1 centrepiece'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full room transformation', items: ['Balloon arch', 'Custom backdrop', 'Fairy lights', '3 centrepieces', 'Neon sign'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand VIP birthday experience', items: ['Grand balloon installation', 'Photo booth setup', 'LED letters', 'Floral arrangements', 'Premium draping', 'Photographer coordination'] },
    ],
    addons: ['Photography', 'Cake', 'DJ / Music', 'Catering', 'Party favours'],
  },
  {
    slug: 'wedding-decorations', name: 'Wedding Decorations', emoji: '👰',
    shortDesc: 'Grand mandaps, floral arches, entrance décor, stage backdrop.',
    longDesc: 'Your wedding day deserves nothing but the best. We create majestic wedding setups featuring grand floral mandaps, stunning stage backdrops, elegant entrance décor, and everything in between.',
    image: '/services/service_wedding.png', category: 'wedding', sortOrder: 2,
    included: ['Grand floral mandap', 'Stage backdrop', 'Entrance arch', 'Aisle decoration', 'Table floral centrepieces', 'Photo booth', 'Welcome gate'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Elegant simple wedding setup', items: ['Mandap décor', 'Stage backdrop', 'Entrance flowers'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full wedding venue transformation', items: ['Grand mandap', 'Full stage décor', 'Aisle decoration', 'Photo booth'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Royal wedding experience', items: ['Premium floral mandap', 'Luxury stage', 'Full venue décor', 'Lighting setup', 'Bridal entry setup'] },
    ],
    addons: ['Wedding Photography', 'Videography', 'Catering', 'Entertainment', 'Flower Girls'],
  },
  {
    slug: 'anniversary-decorations', name: 'Anniversary Setups', emoji: '💑',
    shortDesc: 'Romantic candlelit rooms, rose petal trails, milestone setups.',
    longDesc: 'Mark your love story with a breathtaking anniversary setup. From intimate candlelit rooms adorned with rose petals to grand milestone celebrations with golden décor.',
    image: '/services/service_anniversary.png', category: 'anniversary', sortOrder: 3,
    included: ['Rose petal arrangement', 'Candle & fairy light setup', 'Romantic backdrop', 'Number balloon display', 'Floral centrepieces', 'Personalised message board'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Intimate romantic setting', items: ['Rose petals', 'Candles', 'String lights'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full romantic room setup', items: ['Rose petal trail', 'Fairy lights', 'Backdrop', 'Floral arrangement'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand anniversary experience', items: ['Full room décor', 'Champagne setup', 'Flower bed', 'LED pathway', 'Photo display'] },
    ],
    addons: ['Photography', 'Cake', 'Champagne', 'Couple Spa Package'],
  },
  {
    slug: 'baby-shower', name: 'Baby Shower Decorations', emoji: '🍼',
    shortDesc: 'Pastel balloons, welcome boards, baby-safe floral setups.',
    longDesc: 'Celebrate the upcoming arrival with a beautifully decorated baby shower. Our pastel-themed setups feature cloud-like balloon arrangements, delicate floral displays, and personalised welcome boards.',
    image: '/services/service_babyshower.png', category: 'baby', sortOrder: 4,
    included: ['Pastel balloon cloud', 'Welcome board', 'Floral garlands', 'Table setup', 'Balloon bouquets', 'Baby-themed props'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Sweet and simple setup', items: ['Balloon cluster', 'Welcome board', 'Table centrepiece'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full baby shower transformation', items: ['Balloon cloud wall', 'Floral arch', 'Full table setup', 'Props'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand baby shower celebration', items: ['Premium balloon installation', 'Floral backdrop', 'Full venue décor', 'Photo booth'] },
    ],
    addons: ['Photography', 'Cake', 'Favours', 'Games Setup'],
  },
  {
    slug: 'corporate-events', name: 'Corporate Events', emoji: '🏢',
    shortDesc: 'Stage décor, branded setups, award ceremonies, product launches.',
    longDesc: 'Make a powerful impression with our professional corporate event setups. From grand stage décor and branded installations to award ceremonies and product launches.',
    image: '/services/service_corporate.png', category: 'corporate', sortOrder: 5,
    included: ['Stage & podium décor', 'Branded backdrop', 'Table arrangements', 'Entrance setup', 'Award ceremony props', 'Corporate floral'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Professional event setup', items: ['Stage backdrop', 'Table décor', 'Entrance'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full corporate setup', items: ['Stage décor', 'Branded elements', 'Full venue'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Premium corporate experience', items: ['Grand stage', 'Full branding', 'Premium décor', 'Lighting design'] },
    ],
    addons: ['AV Equipment', 'Photography', 'Catering', 'Entertainment'],
  },
  {
    slug: 'candlelight-dinner', name: 'Candlelight Dinner Setup', emoji: '🕯️',
    shortDesc: 'Fairy lights, rose petals, private dining atmosphere.',
    longDesc: 'Create the most romantic evening with our exquisite candlelight dinner setups. We transform any space into a private paradise with fairy lights, scented candles, rose petals, and elegant table settings.',
    image: '/services/service_candlelight.png', category: 'candlelight', sortOrder: 6,
    included: ['Candlelight ambiance', 'Rose petal arrangement', 'Fairy lights', 'Decorated table for 2', 'Floral centrepiece', 'Personalised menu card'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Romantic table for two', items: ['Candles', 'Rose petals', 'Table setup'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full romantic setting', items: ['Fairy lights', 'Rose petal path', 'Full table décor', 'Flowers'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Private dining paradise', items: ['Full venue transformation', 'Premium flowers', 'Champagne setup', 'Personalised elements'] },
    ],
    addons: ['Catering', 'Photography', 'Live Music', 'Personalised Gifts'],
  },
  {
    slug: 'premium-luxury-decor', name: 'Premium Luxury Decor', emoji: '✨',
    shortDesc: 'Neon lights, sequin walls, casino themes, ultra-premium setups.',
    longDesc: 'For those who want nothing but the absolute best. Our premium luxury décor service pushes boundaries with custom neon installations, floor-to-ceiling sequin walls, casino and glamour themes.',
    image: '/services/service_premium.png', category: 'premium', sortOrder: 7,
    included: ['Custom neon sign', 'Sequin/glitter wall', 'LED installation', 'Premium backdrop', 'Luxury floral', 'Premium lighting'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Premium touch setup', items: ['Neon sign', 'Premium décor', 'Lighting'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full luxury setup', items: ['Sequin wall', 'Neon signs', 'Full premium décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Ultra premium experience', items: ['Custom installations', 'Full venue luxury', 'Premium everything', 'Designer elements'] },
    ],
    addons: ['Photography', 'Videography', 'Catering', 'Entertainment', 'Security'],
  },
  {
    slug: 'proposal-setup', name: 'Proposal Setups', emoji: '💝',
    shortDesc: 'Romantic customised marry-me balloon décor, intimate setups.',
    longDesc: 'Pop the question in the most memorable way possible. Our proposal setups create perfectly romantic, personalised environments that set the stage for your big moment.',
    image: '/services/service_proposal.png', category: 'proposal', sortOrder: 8,
    included: ['Marry Me balloon letters', 'Rose petal arrangement', 'Candle setup', 'Fairy lights', 'Floral décor', 'Romantic ambiance'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple romantic setup', items: ['Rose petals', 'Candles', 'Fairy lights'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full proposal setup', items: ['Balloon letters', 'Full romantic décor', 'Photography spot'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand proposal experience', items: ['Premium balloon display', 'Full venue', 'Photographer', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Videography', 'Ring Box', 'Champagne', 'Personalised Gifts'],
  },
  {
    slug: 'kids-birthday-party', name: 'Kids Birthday Parties', emoji: '🧸',
    shortDesc: 'Character themes, soft décor, play-safe balloon sculptures.',
    longDesc: 'Make your little one\'s birthday a magical adventure! Our kids\' party setups feature beloved character themes, safe and colorful balloon sculptures, interactive décor.',
    image: '/services/service_birthday.png', category: 'birthday', sortOrder: 9,
    included: ['Character theme décor', 'Safe balloon sculptures', 'Photo backdrop', 'Party props', 'Table setup', 'Goody bag area'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Fun theme setup', items: ['Theme backdrop', 'Balloon cluster', 'Table décor'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full party transformation', items: ['Character arch', 'Full theme décor', 'Photo booth', 'Props'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand party experience', items: ['Premium theme installation', 'Full venue', 'Soft play area décor', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Cake', 'Entertainer/Magician', 'Party Favours', 'Games Setup'],
  },
  {
    slug: 'engagement-ceremony', name: 'Engagement Ceremony', emoji: '💍',
    shortDesc: 'Floral stages, photo backdrops, ring ceremony setups.',
    longDesc: 'Mark the beginning of forever with a stunning engagement ceremony setup. Our team creates elegant floral stages, beautiful ring ceremony décor, and spectacular photo backdrops.',
    image: '/services/service_wedding.png', category: 'wedding', sortOrder: 10,
    included: ['Floral stage', 'Ring ceremony setup', 'Photo backdrop', 'Entrance decoration', 'Table floral', 'Welcome arch'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple elegant setup', items: ['Stage décor', 'Backdrop', 'Flowers'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full engagement setup', items: ['Floral stage', 'Photo backdrop', 'Full décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand engagement celebration', items: ['Premium floral stage', 'Full venue', 'Photo booth', 'Lighting'] },
    ],
    addons: ['Photography', 'Videography', 'Catering', 'Entertainment'],
  },
  {
    slug: 'bachelorette-party', name: 'Bachelorette Party', emoji: '👑',
    shortDesc: 'Glam setups, neon signs, bride-tribe balloon walls.',
    longDesc: 'Give the bride-to-be the send-off she deserves! Our bachelorette party setups are glamorous, fun, and Instagram-worthy.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 11,
    included: ['Neon sign', 'Balloon wall', 'Glam backdrop', 'Party props', 'Gold & pink theme décor', 'Personalised banners'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Fun party setup', items: ['Balloon wall', 'Banner', 'Props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Glam bachelorette', items: ['Neon sign', 'Full balloon wall', 'Photo booth', 'Theme décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Ultimate bridal experience', items: ['Premium neon', 'Sequin wall', 'Full venue décor', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Cake', 'Party Favours', 'DJ Setup'],
  },
  {
    slug: 'welcome-baby', name: 'Welcome Baby Decorations', emoji: '👶',
    shortDesc: 'Boy/girl themed hospital & home welcome décor.',
    longDesc: 'Welcome your bundle of joy in style! Our welcome baby decorations are specially designed for both hospital visits and home celebrations.',
    image: '/services/service_babyshower.png', category: 'baby', sortOrder: 12,
    included: ['Theme balloon arch', 'Baby name board', 'Welcome banner', 'Door decoration', 'Photo props', 'Soft toy arrangement'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple welcome setup', items: ['Balloon bouquet', 'Welcome banner', 'Door décor'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full welcome home setup', items: ['Balloon arch', 'Name board', 'Full room décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand welcome celebration', items: ['Premium installation', 'Full décor', 'Photo booth', 'Personalised items'] },
    ],
    addons: ['Photography', 'Cake', 'Personalised Gifts'],
  },
  {
    slug: 'mehndi-ceremony', name: 'Mehndi Ceremony Decor', emoji: '🌸',
    shortDesc: 'Vibrant floral setups, marigold curtains, boho-chic stages.',
    longDesc: 'Set the mood for a lively mehndi ceremony with our vibrant, colourful setups. We specialise in marigold curtain installations, floral swing setups, bohemian draping.',
    image: '/services/service_wedding.png', category: 'wedding', sortOrder: 13,
    included: ['Marigold curtain backdrop', 'Floral swing', 'Colourful draping', 'Seating décor', 'Umbrella installation', 'Welcome arch'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Colourful mehndi setup', items: ['Floral backdrop', 'Seating décor', 'Props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full mehndi transformation', items: ['Marigold installation', 'Swing', 'Full stage décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand mehndi celebration', items: ['Premium floral curtain', 'Swing setup', 'Full venue', 'Lighting'] },
    ],
    addons: ['Photography', 'Mehndi Artist', 'Catering', 'DJ Setup'],
  },
  {
    slug: 'haldi-ceremony', name: 'Haldi Ceremony Decor', emoji: '🟡',
    shortDesc: 'Yellow marigold backdrop, sunflower arches, vibrant setups.',
    longDesc: 'Make your haldi ceremony a joyful explosion of colour and tradition. Our haldi setups feature beautiful marigold flower walls, sunflower arches, yellow draping.',
    image: '/services/service_wedding.png', category: 'wedding', sortOrder: 14,
    included: ['Marigold flower wall', 'Sunflower arch', 'Yellow draping', 'Clay pot décor', 'Seating arrangement', 'Backdrop'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Traditional haldi setup', items: ['Flower backdrop', 'Yellow décor', 'Seating'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full haldi setup', items: ['Marigold wall', 'Sunflower arch', 'Full stage décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand haldi celebration', items: ['Premium installations', 'Full venue', 'Floral draping', 'Photography setup'] },
    ],
    addons: ['Photography', 'Catering', 'Traditional Music', 'Custom Invites'],
  },
  {
    slug: 'reception-decor', name: 'Wedding Reception Decor', emoji: '🥂',
    shortDesc: 'Grand reception stages, champagne towers, luxury floral.',
    longDesc: 'The wedding reception is the grandest celebration of your union. Our reception décor team creates breathtaking stage setups, elegant table arrangements, luxurious floral installations.',
    image: '/services/service_wedding.png', category: 'wedding', sortOrder: 15,
    included: ['Grand reception stage', 'Floral centrepieces', 'Champagne tower setup', 'Full table décor', 'Entrance installation', 'Dance floor lighting'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Elegant reception setup', items: ['Stage décor', 'Table flowers', 'Entrance'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full reception décor', items: ['Grand stage', 'Full table décor', 'Champagne tower', 'Dance floor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Royal reception experience', items: ['Premium stage', 'Luxury floral', 'Full venue transformation', 'Designer lighting'] },
    ],
    addons: ['DJ & Sound', 'Photography', 'Videography', 'Catering', 'Entertainment'],
  },
  {
    slug: 'sangeet-night', name: 'Sangeet Night Decor', emoji: '🎶',
    shortDesc: 'Dance-floor ready setups, LED walls, colourful draping.',
    longDesc: 'Sangeet is where the celebrations truly begin! Our sangeet night décor brings together vibrant colours, dynamic LED walls, dance-floor ready lighting.',
    image: '/services/service_wedding.png', category: 'wedding', sortOrder: 16,
    included: ['LED backdrop wall', 'Dance floor lighting', 'Colourful draping', 'Stage setup', 'Photo booth', 'Prop station'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Fun sangeet setup', items: ['Stage décor', 'Lighting', 'Props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full sangeet décor', items: ['LED wall', 'Full lighting', 'Photo booth', 'Stage'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand sangeet experience', items: ['Premium LED', 'Full venue', 'Designer stage', 'Lighting design'] },
    ],
    addons: ['DJ & Sound', 'Choreographer', 'Photography', 'Catering'],
  },
  {
    slug: 'gender-reveal-party', name: 'Gender Reveal Party', emoji: '🩷',
    shortDesc: 'Pink & blue balloon confetti, reveal box, surprise setups.',
    longDesc: 'Make the big announcement in the most magical way! Our gender reveal setups feature stunning pink and blue themed décor, giant confetti balloons.',
    image: '/services/service_babyshower.png', category: 'baby', sortOrder: 17,
    included: ['Pink & blue balloon cloud', 'Reveal confetti balloon', 'Themed backdrop', 'Table setup', 'Props', 'Gender reveal box'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple reveal setup', items: ['Balloon cluster', 'Backdrop', 'Props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full gender reveal party', items: ['Balloon cloud', 'Confetti reveal', 'Full décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand reveal celebration', items: ['Premium balloon installation', 'Full venue', 'Photo booth', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Cake', 'Catering', 'Invites'],
  },
  {
    slug: 'graduation-celebration', name: 'Graduation Celebration', emoji: '🎓',
    shortDesc: 'Mortarboard themes, gold & navy setups, achievement boards.',
    longDesc: 'Celebrate this incredible milestone in style! Our graduation décor features classic mortarboard and diploma themes in gold and navy, achievement display boards.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 18,
    included: ['Graduation themed backdrop', 'Achievement board', 'Gold & navy balloon arch', 'Photo props', 'Banner display', 'Table setup'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple graduation setup', items: ['Balloon bouquet', 'Banner', 'Props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full graduation party', items: ['Balloon arch', 'Full backdrop', 'Table décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand graduation celebration', items: ['Premium installation', 'Full venue', 'Photo booth', 'Personalised board'] },
    ],
    addons: ['Photography', 'Cake', 'Catering', 'DJ Setup'],
  },
  {
    slug: 'farewell-party', name: 'Farewell Party Decor', emoji: '✈️',
    shortDesc: 'Travel themes, memory walls, heartfelt farewell setups.',
    longDesc: 'Send off your loved ones or colleagues in a truly memorable way. Our farewell party décor features travel-inspired themes, memory photo walls.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 19,
    included: ['Travel theme backdrop', 'Memory photo wall', 'Farewell banner', 'Table setup', 'Photo props', 'Message board'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple farewell setup', items: ['Banner', 'Balloon cluster', 'Photo wall'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full farewell party', items: ['Theme backdrop', 'Memory wall', 'Table décor'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand farewell celebration', items: ['Full theme', 'Premium décor', 'Photo booth', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Cake', 'Catering', 'Personalised Gifts'],
  },
  {
    slug: 'retirement-party', name: 'Retirement Party Decor', emoji: '🏖️',
    shortDesc: 'Elegant milestone setups, memory timelines, luxury celebration.',
    longDesc: 'A retirement is a celebration of a lifetime of dedication. Our retirement party décor features elegant milestone displays, career achievement timelines.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 20,
    included: ['Milestone timeline display', 'Elegant backdrop', 'Achievement board', 'Table arrangements', 'Floral centrepieces', 'Welcome board'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Elegant simple setup', items: ['Backdrop', 'Centrepieces', 'Banner'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full retirement celebration', items: ['Timeline display', 'Full décor', 'Floral arrangements'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand retirement party', items: ['Premium installation', 'Full venue', 'Personalised timeline', 'Photo booth'] },
    ],
    addons: ['Photography', 'Catering', 'Live Music', 'Personalised Gifts'],
  },
  {
    slug: 'first-birthday', name: 'First Birthday Photoshoot', emoji: '🎠',
    shortDesc: 'Smash cake setups, dreamy backdrops, milestone photo scenes.',
    longDesc: 'Capture your baby\'s first birthday in the most adorable way possible. Our first birthday photoshoot setups include dreamy smash-cake stations, soft pastel balloon arrangements.',
    image: '/services/service_birthday.png', category: 'birthday', sortOrder: 21,
    included: ['Smash cake station', 'Number \'1\' balloon display', 'Dreamy backdrop', 'Balloon cloud', 'Photo props', 'Floral arrangement'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple first birthday setup', items: ['Balloon cluster', 'Number display', 'Backdrop'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full photo setup', items: ['Smash cake station', 'Full backdrop', 'Balloon cloud', 'Props'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand first birthday experience', items: ['Premium photo setup', 'Multiple scenes', 'Full décor', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Cake', 'Videography', 'Personalised Invites'],
  },
  {
    slug: 'milestone-birthday', name: 'Milestone Birthday (30/40/50)', emoji: '🥳',
    shortDesc: 'Personalised number setups, gold & black elegant themes.',
    longDesc: 'Milestone birthdays deserve milestone décor. Whether it\'s a fabulous 30, flirty 40, or fantastic 50, our milestone birthday setups feature elegant gold and black themes.',
    image: '/services/service_birthday.png', category: 'birthday', sortOrder: 22,
    included: ['Giant number balloons', 'Gold & black themed décor', 'Photo memory wall', 'Personalised backdrop', 'Floral arrangements', 'Milestone banner'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Elegant milestone setup', items: ['Number balloons', 'Banner', 'Centrepieces'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full milestone celebration', items: ['Giant numbers', 'Full backdrop', 'Table décor', 'Flowers'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand milestone experience', items: ['Premium installation', 'Full venue', 'Photo wall', 'Neon sign', 'Photo booth'] },
    ],
    addons: ['Photography', 'Cake', 'DJ Setup', 'Catering', 'Video Montage'],
  },
  {
    slug: 'surprise-birthday', name: 'Surprise Birthday Party', emoji: '🎉',
    shortDesc: 'Secret setups, quick transform decor, dramatic reveal moments.',
    longDesc: 'Planning a surprise? We specialise in swift, secret setups that transform a space while the birthday person is away.',
    image: '/services/service_birthday.png', category: 'birthday', sortOrder: 23,
    included: ['Quick-setup balloon display', 'Surprise banner', 'LED string décor', 'Photo backdrop', 'Table setup', 'Confetti cannon'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Quick surprise setup', items: ['Balloons', 'Banner', 'Basic décor'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full surprise transformation', items: ['Balloon arch', 'Full backdrop', 'Table décor', 'Confetti'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand surprise experience', items: ['Full venue setup', 'Neon sign', 'Photo booth', 'Premium décor'] },
    ],
    addons: ['Photography', 'Cake', 'DJ Setup', 'Catering'],
  },
  {
    slug: 'princess-theme-party', name: 'Princess / Prince Theme', emoji: '👸',
    shortDesc: 'Royal castle backdrops, tiara setups, fairytale décor.',
    longDesc: 'Let your little one live their royal fantasy! Our princess and prince themed parties feature majestic castle backdrops, sparkling tiara balloon arches.',
    image: '/services/service_birthday.png', category: 'birthday', sortOrder: 24,
    included: ['Castle backdrop', 'Tiara/crown balloon arch', 'Royal colour draping', 'Throne chair décor', 'Table setup', 'Character props'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Royal simple setup', items: ['Balloon arch', 'Backdrop', 'Props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full princess/prince party', items: ['Castle backdrop', 'Full theme décor', 'Photo booth'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand royal experience', items: ['Premium castle theme', 'Throne setup', 'Full venue', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Cake', 'Character Appearance', 'Party Favours'],
  },
  {
    slug: 'unicorn-theme-party', name: 'Unicorn Theme Party', emoji: '🦄',
    shortDesc: 'Rainbow balloons, pastel clouds, magical unicorn setups.',
    longDesc: 'Bring the magic of unicorns to life with our enchanting unicorn theme parties! Featuring rainbow balloon garlands, pastel cloud installations, glitter backdrops.',
    image: '/services/service_birthday.png', category: 'birthday', sortOrder: 25,
    included: ['Rainbow balloon garland', 'Pastel cloud wall', 'Unicorn horn backdrop', 'Glitter table setup', 'Photo props', 'Floral display'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Magical simple setup', items: ['Balloon garland', 'Backdrop', 'Props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full unicorn party', items: ['Cloud wall', 'Full theme décor', 'Photo booth'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand magical experience', items: ['Premium cloud installation', 'Full venue', 'Glitter wall', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Cake', 'Party Favours', 'Character Costume'],
  },
  {
    slug: 'outdoor-party', name: 'Outdoor Party Setup', emoji: '🌳',
    shortDesc: 'Terrace parties, garden gatherings, fairy-light canopies.',
    longDesc: 'Take the celebration outside with our stunning outdoor party setups. From romantic terrace gatherings under fairy light canopies to garden parties with elegant floral arrangements.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 26,
    included: ['Fairy light canopy', 'Outdoor floral arrangements', 'String light installation', 'Table & seating décor', 'Entrance arch', 'Ambient lighting'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple outdoor setup', items: ['String lights', 'Table décor', 'Basic flowers'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full outdoor transformation', items: ['Light canopy', 'Floral arrangements', 'Full setup'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Premium outdoor experience', items: ['Grand canopy', 'Premium flowers', 'Full venue', 'Lighting design'] },
    ],
    addons: ['Photography', 'Catering', 'DJ Setup', 'Weather Backup Plan'],
  },
  {
    slug: 'festival-decorations', name: 'Festival Decorations', emoji: '🎪',
    shortDesc: 'Diwali, Christmas, Onam, Eid, Holi themed décor.',
    longDesc: 'Celebrate every festival with authentic and vibrant decorations that capture the true spirit of the occasion.',
    image: '/services/service_premium.png', category: 'festivals', sortOrder: 27,
    included: ['Theme-specific décor elements', 'Floral/diya arrangements', 'Entrance decoration', 'Home interiors', 'Lighting setup', 'Traditional props'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Essential festival décor', items: ['Main decoration', 'Lighting', 'Traditional elements'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full festival transformation', items: ['Full home décor', 'Premium elements', 'Lighting'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand festival celebration', items: ['Complete venue', 'Premium décor', 'Custom elements', 'Photography'] },
    ],
    addons: ['Photography', 'Catering', 'Entertainment', 'Traditional Music'],
  },
  {
    slug: 'diwali-decoration', name: 'Diwali Home Decoration', emoji: '🪔',
    shortDesc: 'Rangoli, diya arrangements, golden light décor for Diwali.',
    longDesc: 'Welcome the festival of lights with stunning Diwali home decorations. Our team creates intricate rangoli designs, beautiful diya arrangements, marigold garlands.',
    image: '/services/service_premium.png', category: 'festivals', sortOrder: 28,
    included: ['Rangoli design', 'Diya arrangement', 'Marigold garlands', 'Entrance décor', 'Interior lighting', 'Traditional elements'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Essential Diwali setup', items: ['Rangoli', 'Diya décor', 'Entrance'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full home Diwali décor', items: ['Full interior décor', 'Marigold garlands', 'Premium lighting'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand Diwali celebration', items: ['Custom rangoli', 'Full home décor', 'Premium diyas', 'Photography'] },
    ],
    addons: ['Photography', 'Homemade Sweets', 'Puja Coordination', 'Live Music'],
  },
  {
    slug: 'christmas-new-year', name: 'Christmas & New Year Decor', emoji: '🎄',
    shortDesc: 'Christmas trees, wreaths, NYE countdown balloon drops.',
    longDesc: 'Deck the halls with our spectacular Christmas and New Year décor! From elegantly decorated Christmas trees and fragrant wreaths to dazzling New Year\'s Eve countdown setups.',
    image: '/services/service_premium.png', category: 'festivals', sortOrder: 29,
    included: ['Decorated Christmas tree', 'Wreaths & garlands', 'Fairy light installation', 'NYE countdown arch', 'Balloon drop net', 'Festive table décor'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Festive simple setup', items: ['Tree décor', 'Wreaths', 'Lights'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full festive décor', items: ['Premium tree', 'Full interior', 'NYE arch'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand festive experience', items: ['Premium tree', 'Full venue', 'Balloon drop', 'Countdown setup'] },
    ],
    addons: ['Photography', 'Catering', 'DJ Setup', 'Personalised Gifts'],
  },
  {
    slug: 'house-warming', name: 'House Warming Ceremony', emoji: '🏡',
    shortDesc: 'Puja-ready décor, floral entrance, auspicious home blessing setups.',
    longDesc: 'Begin your new chapter in a beautifully decorated home. Our house warming ceremony décor includes auspicious floral entrance arrangements, traditional torans, puja area setups.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 30,
    included: ['Floral entrance arch', 'Traditional toran', 'Puja area setup', 'Marigold garlands', 'Welcome board', 'Interior florals'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Traditional simple setup', items: ['Entrance décor', 'Toran', 'Puja setup'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full housewarming décor', items: ['Floral arch', 'Interior décor', 'Puja area', 'Welcome board'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand housewarming', items: ['Premium florals', 'Full interior', 'Photo setup', 'Personalised elements'] },
    ],
    addons: ['Priest/Pandit Coordination', 'Photography', 'Catering', 'Traditional Music'],
  },
  {
    slug: 'naming-ceremony', name: 'Naming Ceremony Decor', emoji: '📜',
    shortDesc: 'Elegant namkaran setups, cradle décor, baby welcome florals.',
    longDesc: 'Welcome your baby into the world with a beautifully decorated naming ceremony. Our namkaran décor features elegant cradle decorations, soft floral arrangements.',
    image: '/services/service_babyshower.png', category: 'baby', sortOrder: 31,
    included: ['Decorated cradle', 'Baby name banner', 'Floral backdrop', 'Welcome board', 'Traditional décor elements', 'Photo props'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple naming ceremony', items: ['Cradle décor', 'Banner', 'Floral arrangement'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full naming ceremony décor', items: ['Premium cradle', 'Full backdrop', 'Floral arch'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand naming celebration', items: ['Premium installation', 'Full venue', 'Photo booth', 'Personalised elements'] },
    ],
    addons: ['Photography', 'Priest Coordination', 'Catering', 'Personalised Name Board'],
  },
  {
    slug: 'bridal-suite-decoration', name: 'Bridal Suite Decoration', emoji: '🌹',
    shortDesc: 'Romantic bridal room with rose petals, draping, fairy lights.',
    longDesc: 'Make the wedding night unforgettable with our romantic bridal suite decoration. We transform hotel rooms and bridal suites into dreamy, rose-scented sanctuaries.',
    image: '/services/service_wedding.png', category: 'wedding', sortOrder: 32,
    included: ['Rose petal trail', 'Fairy light canopy', 'Sheer draping', 'Floral bed arrangement', 'Champagne setup', 'Personalised message'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Romantic room setup', items: ['Rose petals', 'Fairy lights', 'Flowers'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full bridal suite', items: ['Petal trail', 'Canopy', 'Draping', 'Champagne'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Premium bridal night', items: ['Full suite transformation', 'Premium flowers', 'Personalised touches', 'Photographer'] },
    ],
    addons: ['Photography', 'Champagne & Chocolates', 'Personalised Gifts', 'Spa Essentials'],
  },
  {
    slug: 'balloon-sculpture-art', name: 'Balloon Sculpture & Art', emoji: '🎈',
    shortDesc: 'Giant balloon installations, organic walls, 3D sculptures.',
    longDesc: 'Elevate any event with our stunning balloon sculpture and art installations. Our balloon artists create everything from organic balloon walls and dramatic arch tunnels to giant 3D sculptures.',
    image: '/services/service_birthday.png', category: 'premium', sortOrder: 33,
    included: ['Organic balloon wall', 'Balloon arch tunnel', '3D balloon sculpture', 'Balloon ceiling garland', 'Custom balloon art', 'Installation & removal'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple balloon art', items: ['Balloon wall', 'Arch', 'Basic sculpture'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full balloon installation', items: ['Organic wall', 'Arch tunnel', 'Custom art'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand balloon experience', items: ['3D sculptures', 'Full venue balloons', 'Ceiling installation', 'Custom designs'] },
    ],
    addons: ['Photography', 'LED Lighting', 'Custom Colours', 'Dry Ice Effect'],
  },
  {
    slug: 'floral-wall-installation', name: 'Floral Wall Installation', emoji: '🌺',
    shortDesc: 'Lush flower walls, floral arches, botanical statement pieces.',
    longDesc: 'Create breathtaking floral focal points with our stunning wall installations. From lush floor-to-ceiling fresh flower walls to premium silk artificial blooms.',
    image: '/services/service_premium.png', category: 'premium', sortOrder: 34,
    included: ['Floor-to-ceiling flower wall', 'Floral arch frame', 'Mixed bloom arrangement', 'Green foliage accents', 'Installation & setup', 'Post-event removal'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple floral wall', items: ['4x4 flower wall', 'Basic blooms', 'Frame'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full floral installation', items: ['6x6 flower wall', 'Mixed blooms', 'Arch', 'Foliage'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand floral experience', items: ['Full custom wall', 'Premium flowers', '3D elements', 'Lighting integration'] },
    ],
    addons: ['Photography', 'Custom Signage', 'LED Integration', 'Fragrance Diffusers'],
  },
  {
    slug: 'led-lighting-setup', name: 'LED & Lighting Setup', emoji: '💡',
    shortDesc: 'Fairy lights, neon signs, uplighting, atmospheric LED setups.',
    longDesc: 'Transform any space with the magic of light. Our LED and lighting setup service covers everything from warm fairy light canopies and colourful uplighting to custom neon signs.',
    image: '/services/service_premium.png', category: 'premium', sortOrder: 35,
    included: ['Fairy light installation', 'Uplighting setup', 'LED backdrop lighting', 'Custom neon sign', 'Path lighting', 'Colour programming'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple lighting setup', items: ['String lights', 'Basic uplighting', 'Fairy canopy'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full lighting design', items: ['Full uplighting', 'Neon sign', 'LED integration'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Premium lighting experience', items: ['Full lighting design', 'Neon signs', 'LED dance floor', 'Custom programming'] },
    ],
    addons: ['DJ Coordination', 'Photography', 'Custom Neon Text', 'Gobo Projection'],
  },
  {
    slug: 'photo-booth-setup', name: 'Photo Booth Setup', emoji: '📸',
    shortDesc: 'Themed booths, fun props, instant print stations.',
    longDesc: 'Give your guests an unforgettable interactive experience with our photo booth setups. We create fully themed booths with custom backdrops, fun prop boxes, ring light setups.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 36,
    included: ['Custom backdrop', 'Prop box (20+ items)', 'Ring light setup', 'Frame or booth structure', 'Signage', 'Optional print station'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple photo corner', items: ['Backdrop', 'Props', 'Lighting'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full photo booth', items: ['Custom backdrop', 'Full prop box', 'Booth frame', 'Ring light'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Premium photo experience', items: ['Themed booth', 'Custom props', 'Print station', 'Digital gallery'] },
    ],
    addons: ['Instant Printing', 'GIF Booth', 'Digital Album', 'Custom Photo Frames'],
  },
  {
    slug: 'pool-party-decoration', name: 'Pool Party Decoration', emoji: '🏊',
    shortDesc: 'Tropical inflatables, neon signs, float décor, poolside setups.',
    longDesc: 'Make a splash with our vibrant pool party decorations! From giant tropical inflatables floating in the pool to poolside string lights, palm leaf arrangements.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 37,
    included: ['Pool inflatables', 'Poolside string lights', 'Tropical floral arrangement', 'Welcome sign', 'Float décor', 'Table & bar setup'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Fun pool setup', items: ['Inflatables', 'String lights', 'Tropical props'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full tropical party', items: ['Full inflatable set', 'Poolside décor', 'Bar setup'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Premium pool experience', items: ['Premium inflatables', 'Full venue décor', 'Neon sign', 'Full bar setup'] },
    ],
    addons: ['DJ & Sound', 'Photography', 'Catering', 'Lifeguard Coordination'],
  },
  {
    slug: 'kitty-party-setup', name: 'Kitty Party Setup', emoji: '🐱',
    shortDesc: 'Elegant theme setups, table décor, fun activity zones.',
    longDesc: 'Make your kitty party the talk of the group! Our kitty party setups feature elegant themed décor, beautifully arranged tables, fun activity zones.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 38,
    included: ['Theme backdrop', 'Table décor', 'Centrepieces', 'Activity zone setup', 'Welcome board', 'Photo corner'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple kitty party', items: ['Table décor', 'Backdrop', 'Welcome board'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full kitty party setup', items: ['Theme décor', 'Activity zone', 'Photo corner'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Grand kitty celebration', items: ['Premium theme', 'Full décor', 'Photo booth', 'Games setup'] },
    ],
    addons: ['Photography', 'Catering', 'Games Coordination', 'Personalised Favours'],
  },
  {
    slug: 'virtual-events', name: 'Virtual Events', emoji: '💻',
    shortDesc: 'Streaming-ready setups, green screen, digital backdrop coordination.',
    longDesc: 'Bring your virtual events to life with professional streaming-ready setups. Whether it\'s a virtual birthday party, online conference, or digital celebration.',
    image: '/services/service_corporate.png', category: 'corporate', sortOrder: 39,
    included: ['Backdrop setup', 'Lighting for streaming', 'Props & décor', 'Green screen option', 'Digital coordination', 'Technical setup guidance'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Simple virtual backdrop', items: ['Backdrop', 'Basic lighting'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full virtual event setup', items: ['Premium backdrop', 'Full lighting', 'Props', 'Green screen'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Professional virtual studio', items: ['Studio setup', 'Premium lighting', 'Full décor', 'Technical support'] },
    ],
    addons: ['Technical Support', 'Photography', 'Live Streaming Setup'],
  },
  {
    slug: 'product-launch-event', name: 'Product Launch Event', emoji: '🚀',
    shortDesc: 'Branded unveil setups, spotlight stages, premium product décor.',
    longDesc: 'Launch your product with maximum impact. Our product launch event décor creates high-energy branded environments with dramatic spotlight unveiling stages.',
    image: '/services/service_corporate.png', category: 'corporate', sortOrder: 40,
    included: ['Branded backdrop', 'Product unveil stage', 'Spotlight setup', 'Press photo area', 'Corporate floral', 'Branded table décor'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Professional launch setup', items: ['Backdrop', 'Stage décor', 'Branding'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full launch event', items: ['Branded stage', 'Full venue', 'Press area'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Premium launch experience', items: ['Grand stage', 'Full branding', 'Premium décor', 'Lighting design'] },
    ],
    addons: ['AV & Sound', 'Photography', 'Videography', 'PR Coordination'],
  },
  {
    slug: 'award-ceremony', name: 'Award Ceremony Setup', emoji: '🏆',
    shortDesc: 'Red carpet, trophy displays, grand stage, spotlight setups.',
    longDesc: 'Make your award ceremony a night to remember. Our award ceremony setups feature iconic red carpet entrances, dramatic stage backdrops, golden trophy display tables.',
    image: '/services/service_corporate.png', category: 'corporate', sortOrder: 41,
    included: ['Red carpet entrance', 'Grand stage backdrop', 'Trophy display table', 'Award props', 'Stage podium décor', 'Ambient lighting'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Professional awards setup', items: ['Stage backdrop', 'Podium', 'Red carpet'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full awards ceremony', items: ['Grand stage', 'Red carpet', 'Trophy table', 'Lighting'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Gala awards experience', items: ['Premium stage', 'Full venue', 'Custom branding', 'Designer lighting'] },
    ],
    addons: ['AV Equipment', 'Photography', 'MC/Host', 'Catering', 'Entertainment'],
  },
  {
    slug: 'customised-decor', name: 'Customised Decorations', emoji: '🎨',
    shortDesc: 'Fully personalised themes, names, photos, colours.',
    longDesc: 'Can\'t find exactly what you\'re looking for? Our fully customised decoration service brings any vision to life.',
    image: '/services/service_premium.png', category: 'special', sortOrder: 42,
    included: ['Custom theme design', 'Personalised elements', 'Photo integration', 'Custom colour palette', 'Unique props', 'Bespoke backdrop'],
    packages: [
      { planType: PlanType.BASIC, name: 'Basic', description: 'Custom small setup', items: ['Custom theme', 'Basic elements', 'Personalisation'] },
      { planType: PlanType.PREMIUM, name: 'Premium', description: 'Full custom setup', items: ['Full custom theme', 'Premium materials', 'Photo integration'] },
      { planType: PlanType.LUXURY, name: 'Luxury', description: 'Complete bespoke experience', items: ['Designer concept', 'Premium custom décor', 'Full venue', 'Photography'] },
    ],
    addons: ['Photography', 'Videography', 'Catering', 'Entertainment', 'Custom Gifts'],
  },
];

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', category: 'birthday', alt: 'Birthday balloon arch', sortOrder: 1 },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', category: 'wedding', alt: 'Wedding floral arch', sortOrder: 2 },
  { src: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600&q=80', category: 'anniversary', alt: 'Anniversary decoration', sortOrder: 3 },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', category: 'corporate', alt: 'Corporate event', sortOrder: 4 },
  { src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80', category: 'baby', alt: 'Baby shower pastel', sortOrder: 5 },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', category: 'candlelight', alt: 'Candlelight dinner', sortOrder: 6 },
  { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80', category: 'premium', alt: 'Premium neon decor', sortOrder: 7 },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', category: 'birthday', alt: 'Kids party', sortOrder: 8 },
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80', category: 'special', alt: 'Outdoor fairy lights', sortOrder: 9 },
  { src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', category: 'special', alt: 'Custom decoration', sortOrder: 10 },
  { src: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=600&q=80', category: 'special', alt: 'Bachelorette party', sortOrder: 11 },
  { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', category: 'proposal', alt: 'Romantic proposal', sortOrder: 12 },
];

async function seed() {
  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Connected. Starting seed...\n');

  const userRepo = AppDataSource.getRepository(User);
  const serviceRepo = AppDataSource.getRepository(Service);
  const packageRepo = AppDataSource.getRepository(ServicePackage);
  const addonRepo = AppDataSource.getRepository(ServiceAddon);
  const galleryRepo = AppDataSource.getRepository(GalleryImage);

  // ── Admin user ──────────────────────────────────────────
  const adminEmail = 'kirankks.1432@gmail.com';
  const existing = await userRepo.findOne({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin already exists, skipping admin seed.');
  } else {
    const hashedPassword = await bcrypt.hash('8943984195', 12);
    const admin = userRepo.create({
      name: 'Kiran Admin',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });
    // bypass @BeforeInsert since we're manually hashing
    admin.hashPassword = async () => {};
    await userRepo.save(admin);
    console.log(`✓ Admin seeded: ${adminEmail}`);
  }

  // ── Services ────────────────────────────────────────────
  let servicesCreated = 0;
  let servicesSkipped = 0;

  for (const svc of SERVICES) {
    const exists = await serviceRepo.findOne({ where: { slug: svc.slug } });
    if (exists) { servicesSkipped++; continue; }

    const service = serviceRepo.create({
      slug: svc.slug,
      name: svc.name,
      emoji: svc.emoji,
      shortDesc: svc.shortDesc,
      longDesc: svc.longDesc,
      image: svc.image,
      category: svc.category,
      included: svc.included,
      isActive: true,
      sortOrder: svc.sortOrder,
    });
    const saved = await serviceRepo.save(service);

    const pkgs = svc.packages.map((p) =>
      packageRepo.create({
        serviceId: saved.id,
        planType: p.planType,
        name: p.name,
        description: p.description,
        items: p.items,
        price: null,
      }),
    );
    await packageRepo.save(pkgs);

    const addons = svc.addons.map((name) =>
      addonRepo.create({ serviceId: saved.id, name }),
    );
    await addonRepo.save(addons);

    servicesCreated++;
  }

  console.log(`✓ Services: ${servicesCreated} created, ${servicesSkipped} skipped`);

  // ── Gallery ─────────────────────────────────────────────
  const galleryCount = await galleryRepo.count();
  if (galleryCount === 0) {
    const images = GALLERY_IMAGES.map((img) => galleryRepo.create(img));
    await galleryRepo.save(images);
    console.log(`✓ Gallery: ${images.length} images seeded`);
  } else {
    console.log('Gallery already seeded, skipping.');
  }

  console.log('\nSeed completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
