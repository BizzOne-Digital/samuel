import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import models
import AdminUser from '../models/AdminUser';
import SiteSettings from '../models/SiteSettings';
import Page from '../models/Page';
import Service from '../models/Service';
import Book from '../models/Book';
import PricingOffer from '../models/PricingOffer';
import GalleryCategory from '../models/GalleryCategory';
import GalleryImage from '../models/GalleryImage';
import Testimonial from '../models/Testimonial';
import FAQ from '../models/FAQ';
import BlogPost from '../models/BlogPost';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samuel-louis-jean';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
    const clearData = process.argv.includes('--clear');
    if (clearData) {
      console.log('🗑️  Clearing existing data...');
      await AdminUser.deleteMany({});
      await SiteSettings.deleteMany({});
      await Page.deleteMany({});
      await Service.deleteMany({});
      await Book.deleteMany({});
      await PricingOffer.deleteMany({});
      await GalleryCategory.deleteMany({});
      await GalleryImage.deleteMany({});
      await Testimonial.deleteMany({});
      await FAQ.deleteMany({});
      await BlogPost.deleteMany({});
      console.log('✅ Data cleared');
    }

    // Create Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'Admin123!',
      10
    );
    
    await AdminUser.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL || 'admin@samuellouisjean.com' },
      {
        email: process.env.ADMIN_EMAIL || 'admin@samuellouisjean.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'super_admin',
        isActive: true,
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin user created');

    // Create Site Settings
    console.log('⚙️  Creating site settings...');
    await SiteSettings.findOneAndUpdate(
      {},
      {
        siteName: 'Samuel Louis Jean Publications',
        tagline: 'Words That Inspire. Ideas That Transform.',
        defaultSeoTitle: 'Samuel Louis Jean Publications - Author & Speaker',
        defaultSeoDescription: 'Discover the books, conferences, and message of Dr. Samuel Louis Jean—Senior Pastor at Calvary Haitian Baptist Church and author committed to inspiring meaningful growth.',
        contact: {
          email: 'dr.louisjean@yahoo.com',
          phone: '904-444-3061',
          address: '922 Blanding Blvd',
          city: 'Orange Park',
          state: 'FL',
          zip: '32065',
        },
        footer: {
          description: 'Inspiring meaningful growth through powerful words and transformative ideas.',
          copyrightText: '© 2026 Samuel Louis Jean Publications. All rights reserved.',
          newsletterText: 'Stay updated with the latest books, events, and inspiring messages.',
        },
        localization: {
          defaultLanguage: 'en',
          enabledLanguages: ['en', 'fr', 'ht'],
        },
        commerce: {
          currency: 'USD',
          shippingMessage: 'Shipping charges calculated at checkout',
          defaultShippingCharge: 500, // $5.00 in cents
          checkoutInstructions: 'Please complete your order details below. We will contact you to arrange payment and confirm shipping.',
          paymentMethodText: 'Payment instructions will be sent via email',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✅ Site settings created');

    // Create Home Page
    console.log('📄 Creating pages...');
    await Page.findOneAndUpdate(
      { pageKey: 'home' },
      {
        pageKey: 'home',
        title: 'Home',
        slug: '/',
        metaTitle: 'Samuel Louis Jean Publications - Author & Speaker',
        metaDescription: 'Discover the books, conferences, and message of Dr. Samuel Louis Jean.',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            heading: 'Words That Inspire. Ideas That Transform.',
            body: 'Discover the books, conferences, and message of Samuel Louis Jean (Dr. Louis-Jean)—Senior Pastor at Calvary Haitian Baptist Church and author committed to inspiring meaningful growth.',
            primaryCtaLabel: 'Explore the Books',
            primaryCtaUrl: '/books',
            secondaryCtaLabel: 'Book a Speaking Engagement',
            secondaryCtaUrl: '/booking',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
          {
            sectionName: 'Author Introduction',
            eyebrow: 'About the Author',
            heading: 'A Voice for Transformation',
            body: 'Samuel Louis Jean (Dr. Louis-Jean) serves as Senior Pastor at Calvary Haitian Baptist Church, located at 922 Blanding Blvd, Orange Park, FL 32065. A celebrated author and speaker, his work inspires individuals and communities to embrace meaningful change. Through powerful books and engaging conferences, he shares insights that resonate across generations.',
            primaryCtaLabel: 'Learn More About Dr. Louis-Jean',
            primaryCtaUrl: '/about',
            theme: 'cream',
            isVisible: true,
            displayOrder: 2,
          },
          {
            sectionName: 'Featured Books',
            eyebrow: 'Publications',
            heading: 'Transformative Books',
            body: 'Explore a collection of thought-provoking publications designed to inspire, challenge, and empower readers.',
            primaryCtaLabel: 'View All Books',
            primaryCtaUrl: '/books',
            theme: 'dark',
            isVisible: true,
            displayOrder: 3,
          },
          {
            sectionName: 'Speaking & Conferences',
            eyebrow: 'Engagements',
            heading: 'Inspire Your Audience',
            body: 'Book Dr. Samuel Louis Jean for your next conference, event, or speaking engagement. Bring powerful insights and transformative messages to your community.',
            primaryCtaLabel: 'Request a Booking',
            primaryCtaUrl: '/booking',
            secondaryCtaLabel: 'View Services',
            secondaryCtaUrl: '/services',
            theme: 'midnight',
            isVisible: true,
            displayOrder: 4,
          },
          {
            sectionName: 'Special Offer',
            eyebrow: 'Limited Time Offer',
            heading: 'Four Books for $100',
            body: 'Take advantage of our special offer: purchase all four books for just $100 plus shipping. A perfect way to experience the full breadth of Dr. Louis-Jean\'s transformative work.',
            primaryCtaLabel: 'Get This Offer',
            primaryCtaUrl: '/pricing',
            theme: 'gold',
            isVisible: true,
            displayOrder: 5,
          },
          {
            sectionName: 'Testimonials Preview',
            eyebrow: 'What People Say',
            heading: 'Voices of Impact',
            body: 'Hear from those whose lives have been touched by Dr. Jean\'s words and presence.',
            primaryCtaLabel: 'Read All Testimonials',
            primaryCtaUrl: '/testimonials',
            theme: 'cream',
            isVisible: true,
            displayOrder: 6,
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Create About Page
    await Page.findOneAndUpdate(
      { pageKey: 'about' },
      {
        pageKey: 'about',
        title: 'About Dr. Samuel Louis Jean',
        slug: '/about',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            heading: 'A Life Dedicated to Inspiration',
            body: 'Meet Samuel Louis Jean (Dr. Louis-Jean): Senior Pastor at Calvary Haitian Baptist Church, author, and speaker dedicated to meaningful transformation.',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
          {
            sectionName: 'Biography',
            eyebrow: 'The Journey',
            heading: 'From Vision to Voice',
            body: 'Samuel Louis Jean (Dr. Louis-Jean) serves as Senior Pastor at Calvary Haitian Baptist Church located at 922 Blanding Blvd, Orange Park, FL 32065. He has dedicated his life to empowering individuals through the written word and spoken message. With a deep commitment to community, education, and spiritual growth, his work bridges cultures and generations. His books and conferences have reached audiences worldwide, inspiring meaningful change and personal transformation.',
            theme: 'cream',
            isVisible: true,
            displayOrder: 2,
          },
          {
            sectionName: 'Mission',
            eyebrow: 'Our Mission',
            heading: 'Inspiring Growth, One Word at a Time',
            body: 'The mission of Samuel Louis Jean Publications is to provide resources, events, and messages that challenge, inspire, and uplift. We believe in the power of words to transform lives and communities.',
            theme: 'midnight',
            isVisible: true,
            displayOrder: 3,
          },
          {
            sectionName: 'Speaking Vision',
            eyebrow: 'Speaking Engagements',
            heading: 'Bringing Messages That Matter',
            body: 'Dr. Jean speaks at conferences, churches, universities, and community events. His messages are tailored to resonate with diverse audiences, addressing topics of faith, leadership, identity, and purpose.',
            primaryCtaLabel: 'Book Dr. Jean',
            primaryCtaUrl: '/booking',
            theme: 'dark',
            isVisible: true,
            displayOrder: 4,
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Create Books Page
    await Page.findOneAndUpdate(
      { pageKey: 'books' },
      {
        pageKey: 'books',
        title: 'Books',
        slug: '/books',
        metaTitle: 'Books | Samuel Louis Jean Publications',
        metaDescription: 'Explore transformative books by Dr. Samuel Louis Jean',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            eyebrow: 'Publications',
            heading: 'Transformative Books That Inspire Change',
            body: 'Explore a collection of thought-provoking publications designed to inspire, challenge, and empower readers to reach their full potential.',
            backgroundImage: '/hero-bg.png',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Create Gallery Page
    await Page.findOneAndUpdate(
      { pageKey: 'gallery' },
      {
        pageKey: 'gallery',
        title: 'Gallery',
        slug: '/gallery',
        metaTitle: 'Gallery | Samuel Louis Jean Publications',
        metaDescription: 'Photo gallery of events, conferences, and moments',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            eyebrow: 'Photo Gallery',
            heading: 'Capturing Moments That Inspire',
            body: 'A visual journey through conferences, events, and special moments that have shaped our ministry and community.',
            backgroundImage: '/hero-bg.png',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Create Pricing Page
    await Page.findOneAndUpdate(
      { pageKey: 'pricing' },
      {
        pageKey: 'pricing',
        title: 'Pricing',
        slug: '/pricing',
        metaTitle: 'Pricing | Samuel Louis Jean Publications',
        metaDescription: 'View pricing options for books by Dr. Samuel Louis Jean',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            eyebrow: 'Pricing Options',
            heading: 'Simple Pricing',
            body: 'Choose the option that works best for you. All books include insightful content designed to inspire and transform.',
            backgroundImage: '/hero-bg.png',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Create Contact Page
    await Page.findOneAndUpdate(
      { pageKey: 'contact' },
      {
        pageKey: 'contact',
        title: 'Contact',
        slug: '/contact',
        metaTitle: 'Contact | Samuel Louis Jean Publications',
        metaDescription: 'Get in touch with us',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            eyebrow: 'Let Us Connect',
            heading: 'Get in Touch',
            body: 'Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.',
            backgroundImage: '/hero-bg.png',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Create FAQs Page
    await Page.findOneAndUpdate(
      { pageKey: 'faqs' },
      {
        pageKey: 'faqs',
        title: 'Frequently Asked Questions',
        slug: '/faqs',
        metaTitle: 'FAQs | Samuel Louis Jean Publications',
        metaDescription: 'Frequently asked questions about our books and services',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            eyebrow: 'Help Center',
            heading: 'Frequently Asked Questions',
            body: 'Find answers to common questions about our books, shipping, and speaking engagements.',
            backgroundImage: '/hero-bg.png',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
        ],
      },
      { upsert: true, new: true }
    );

    // Create Testimonials Page
    await Page.findOneAndUpdate(
      { pageKey: 'testimonials' },
      {
        pageKey: 'testimonials',
        title: 'Testimonials',
        slug: '/testimonials',
        metaTitle: 'Testimonials | Samuel Louis Jean Publications',
        metaDescription: 'What people say about Dr. Samuel Louis Jean',
        isPublished: true,
        sections: [
          {
            sectionName: 'Hero',
            eyebrow: 'What People Say',
            heading: 'Voices of Impact',
            body: 'Hear from those whose lives have been touched by Dr. Jean\'s words and presence.',
            backgroundImage: '/hero-bg.png',
            theme: 'dark',
            isVisible: true,
            displayOrder: 1,
          },
        ],
      },
      { upsert: true, new: true }
    );
    console.log('✅ Pages created');

    // Create Services
    console.log('🛠️  Creating services...');
    const services = [
      {
        title: 'Author Appearances',
        slug: 'author-appearances',
        shortDescription: 'Book Dr. Samuel Louis Jean for book signings, readings, and literary events.',
        ctaLabel: 'Learn More',
        displayOrder: 1,
        isFeatured: true,
        isPublished: true,
        hero: {
          eyebrow: 'Service',
          title: 'Author Appearances',
          description: 'Connect with readers through meaningful book signings and literary events.',
        },
        detailSections: [
          {
            sectionType: 'overview',
            heading: 'Overview',
            content: 'Dr. Samuel Louis Jean is available for author appearances, book signings, and literary events. These intimate gatherings provide an opportunity for readers to connect with the author and engage with his transformative work.',
            displayOrder: 1,
            isVisible: true,
          },
        ],
      },
      {
        title: 'Speaking Engagements',
        slug: 'speaking-engagements',
        shortDescription: 'Inspire your audience with powerful messages from Dr. Jean.',
        ctaLabel: 'Book Now',
        displayOrder: 2,
        isFeatured: true,
        isPublished: true,
        hero: {
          eyebrow: 'Service',
          title: 'Speaking Engagements',
          description: 'Powerful keynotes and messages for your event or organization.',
        },
        detailSections: [
          {
            sectionType: 'overview',
            heading: 'Overview',
            content: 'Dr. Jean delivers powerful keynote speeches and messages tailored to your audience. Whether for corporate events, educational institutions, or community gatherings, his speaking engagements inspire and transform.',
            displayOrder: 1,
            isVisible: true,
          },
        ],
      },
      {
        title: 'Conferences',
        slug: 'conferences',
        shortDescription: 'Multi-day conferences featuring Dr. Jean\'s transformative teachings.',
        ctaLabel: 'Learn More',
        displayOrder: 3,
        isFeatured: true,
        isPublished: true,
        hero: {
          eyebrow: 'Service',
          title: 'Conferences',
          description: 'Transformative multi-day experiences designed to inspire lasting change.',
        },
        detailSections: [
          {
            sectionType: 'overview',
            heading: 'Overview',
            content: 'Experience transformative multi-day conferences led by Dr. Samuel Louis Jean. These immersive events combine teaching, worship, and community to create lasting impact.',
            displayOrder: 1,
            isVisible: true,
          },
        ],
      },
    ];

    for (const service of services) {
      await Service.findOneAndUpdate(
        { slug: service.slug },
        service,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Services created');

    // Create Books
    console.log('📚 Creating books...');
    const books = [
      {
        title: 'Comprendre la vie à deux dans le mariage',
        slug: 'comprendre-la-vie-a-deux-dans-le-mariage',
        author: 'Dr. Samuel Louis Jean',
        shortDescription: 'Ce tome accompagne les couples dans leur cheminement marital, mêlant sagesse ancestrale et réflexions sur l\'amour, la communication et le lien sacré du mariage.',
        fullDescription: 'Ce tome accompagne les couples dans leur cheminement marital, mêlant sagesse ancestrale et réflexions sur l\'amour, la communication et le lien sacré du mariage. Il se veut une boussole à travers les épreuves et les joies de la vie, promouvant l\'unité et la force que l\'on trouve dans le partenariat. L\'ouvrage célèbre les fondements du mariage — le soutien, la spiritualité, l\'affection — et offre une compréhension approfondie pour une union résiliente et aimante qui résiste aux défis du temps.',
        price: 2500, // $25.00
        format: 'French Edition',
        coverImage: '/books/book-1.png',
        coverImageAlt: 'Comprendre la vie à deux dans le mariage',
        language: 'French',
        category: 'Marriage & Relationships',
        tags: ['New'],
        inStock: true,
        isFeatured: true,
        isPublished: true,
        displayOrder: 1,
      },
      {
        title: 'Franchir Les Obstacles',
        slug: 'franchir-les-obstacles',
        author: 'Dr. Samuel Louis Jean',
        shortDescription: 'Comme un athlète aux jeux olympiques qui cherche à remporter la palme, chacun de vous aimerait franchir les obstacles pour remporter la victoire.',
        fullDescription: 'Comme un athlète aux jeux olympiques qui cherche à remporter la palme, chacun de vous aimerait franchir les obstacles pour remporter la victoire. En fait, qui n\'aimerait pas bien achever la course? Qui n\'aimerait pas réussir dans un ou plusieurs domaines quelconques de la vie? Parfois, il s\'agit de la victoire de la chasteté dans une société débauchée, la victoire dans la vie de famille, la première entité créée par Dieu et dont les valeurs s\'effritent de plus en plus pour enfin disparaître dans certains milieux, la victoire sur l\'économie moribonde, l\'économie agonisante qui bride le pouvoir de vos achats quotidiens et, que sais-je encore? Votre vie est indubitablement faite d\'obstacles. Ils sont le plus souvent d\'ordre personnel, environnemental, médical, émotionnel, éducationnel, aussi et surtout de manque d\'estime de soi...etc. Savoir identifier les obstacles, choisir les voies et moyens pour les franchir et, au delà des obstacles, comment en tirer le meilleur parti, autant de points abordés dans Franchir les obstacles.',
        price: 2500, // $25.00
        format: 'French Edition',
        coverImage: '/books/book-2.png',
        coverImageAlt: 'Franchir Les Obstacles',
        language: 'French',
        category: 'Personal Growth & Spirituality',
        inStock: true,
        isFeatured: true,
        isPublished: true,
        displayOrder: 2,
      },
      {
        title: 'Overcoming Obstacles',
        slug: 'overcoming-obstacles',
        author: 'Dr. Samuel Louis Jean',
        shortDescription: 'English version of Franchir Les Obstacles. Overcoming Obstacles has nothing to do with religion or sects, which tend very often to separate and create friction between people.',
        fullDescription: 'Overcoming Obstacles has nothing to do with religion or sects, which tend very often to separate and create friction between people, whereas God, the Creator of Heaven and earth, reconciles and unites His children who were separated, to make them stronger. Overcoming Obstacles falls under Divine jurisdiction and promotes the Architect of the universe, the Dominator, the Liberator and Sustainer par excellence, who has put everything at your disposal. In fact, Overcoming Obstacles is a book that will motivate you to seek the best of your potential, your true identity in the One who created you, in order to live according to the real "you," meaning through your position as a victor in Christ. It is an incentive to use time to your advantage, to believe that even a sudden inspiration to change one\'s life is possible for whoever actively holds on to his or her dearest dreams. Finally, it is an invitation to retrieve your joys, your courage, your peace, your love, and the prosperity that God has procured for you, starting with your salvation.',
        price: 2500, // $25.00 (English version of Franchir Les Obstacles)
        format: 'English Edition',
        coverImage: '/books/book-3.png',
        coverImageAlt: 'Overcoming Obstacles',
        language: 'English',
        category: 'Personal Growth & Spirituality',
        inStock: true,
        isFeatured: true,
        isPublished: true,
        displayOrder: 3,
      },
      {
        title: 'J\'aime Mon Eglise',
        slug: 'jaime-mon-eglise',
        author: 'Dr. Samuel Louis Jean',
        subtitle: 'I Love My Church',
        shortDescription: 'J\'aime mon Église est un guide à la fois biblique et pratique qui explore la beauté, la mission et la raison d\'être de l\'Église locale.',
        fullDescription: 'J\'aime mon Église est un guide à la fois biblique et pratique qui explore la beauté, la mission et la raison d\'être de l\'Église locale. À travers les Écritures et des enseignements tirés de la vie quotidienne, l\'auteur met en lumière l\'importance de la foi, de la communion fraternelle, de l\'hospitalité, de la croissance spirituelle et de l\'engagement actif au sein du corps de Christ. Encourageant les croyants à aller au-delà d\'une simple présence aux cultes pour vivre un engagement authentique, ce livre est un appel inspirant à aimer, servir et fortifier l\'Église selon le dessein de Dieu.',
        price: 2500, // $25.00
        format: 'French Edition',
        coverImage: '/books/book-4.png',
        coverImageAlt: 'J\'aime Mon Eglise',
        language: 'French',
        category: 'Faith & Church Life',
        tags: ['New'],
        inStock: true,
        isFeatured: false,
        isPublished: true,
        displayOrder: 4,
      },
      {
        title: 'Triompher de l\'adversité',
        slug: 'triompher-de-ladversite',
        author: 'Dr. Samuel Louis Jean',
        shortDescription: 'Un ouvrage à lire et à partager. Dr. Louis-Jean vous donne les voies et moyens pour éviter la désolation, sortir de la dépression et vivre en Vainqueur.',
        fullDescription: '"Triompher de l\'adversité" constitue la troisième publication de l\'auteur. Nous émettons le vœu que ce bouquin fasse jaillir sur son passage le reflet de sa lumière qui, éclairera plus d\'un. Triompher de l\'adversité: Un ouvrage à lire et à partager. À travers ce livre, Dr. Louis-Jean vous donne les voies et moyens pour éviter la désolation, sortir de la dépression et, vivre en Vainqueur. Ce livre facile à lire de 154 pages, et qui contient quatorze (14) chapitres propose une source d\'énergie qui dynamise votre force, un puissant soleil qui dissipe les nuages et qui éclaire votre céleste horizon. "Triompher de l\'adversité" est préfacé par Dr. Daniel Derivois, Professeur des universités en psychopathologie et psychologie clinique à l\'université de Bourgogne en France. "Voici un ouvrage qui donne ou redonne espoir…. Ne soyez pas votre propre adversaire et ne laissez pas le soin à l\'adversaire de vous mettre dos au mur" (Un extrait).',
        price: 2500, // $25.00
        format: 'French Edition',
        coverImage: '/books/book-5.png',
        coverImageAlt: 'Triompher de l\'adversité',
        isbn: '',
        pages: 154,
        language: 'French',
        category: 'Personal Growth & Spirituality',
        inStock: true,
        isFeatured: false,
        isPublished: true,
        displayOrder: 5,
      },
    ];

    for (const book of books) {
      await Book.findOneAndUpdate(
        { slug: book.slug },
        book,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Books created');

    // Create Pricing Offers
    console.log('💰 Creating pricing offers...');
    await PricingOffer.findOneAndUpdate(
      { offerType: 'single_book' },
      {
        name: 'Single Book',
        offerType: 'single_book',
        quantity: 1,
        price: 2500, // $25.00
        label: 'One Book',
        description: 'Purchase any single book',
        isActive: true,
        displayOrder: 1,
      },
      { upsert: true, new: true }
    );

    await PricingOffer.findOneAndUpdate(
      { offerType: 'multi_book' },
      {
        name: 'Four Books Special',
        offerType: 'multi_book',
        quantity: 4,
        price: 10000, // $100.00
        label: 'Four Books for $100',
        description: 'Special offer: Get all four books and save $20',
        isActive: true,
        displayOrder: 2,
      },
      { upsert: true, new: true }
    );
    console.log('✅ Pricing offers created');

    // Create Gallery Categories
    console.log('🖼️  Creating gallery categories...');
    const categories = [
      { name: 'Books', slug: 'books', displayOrder: 1 },
      { name: 'Conferences', slug: 'conferences', displayOrder: 2 },
      { name: 'Speaking Events', slug: 'speaking-events', displayOrder: 3 },
      { name: 'Community', slug: 'community', displayOrder: 4 },
    ];

    for (const category of categories) {
      await GalleryCategory.findOneAndUpdate(
        { slug: category.slug },
        category,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Gallery categories created');

    // Create Testimonials
    console.log('💬 Creating testimonials...');
    await Testimonial.deleteMany({});

    const testimonials = [
      {
        personName: 'Francky SAINT-HUBERT',
        role: 'Commentateur, depuis Paris',
        quote: `Depuis mon adolescence, son nom résonnait déjà avec une certaine admiration. Originaire d'Aquin, cette ville qui a vu naître tant de figures marquantes d'Haïti, Samuel Louis-Jean s'est très tôt distingué par l'excellence de son parcours scolaire et universitaire. Il faisait partie de ces rares esprits dont l'intelligence force le respect sans jamais chercher à l'imposer. Son brillant parcours académique l'a conduit en France, en Inde au Japon, puis aux États-Unis d'Amérique où il a approfondi notamment ses études en théologie (Ph.D).

Cependant, réduire Samuel Louis-Jean à ses diplômes serait une grave erreur. Car ce qui impressionne davantage que son intelligence, c'est son humilité. Ce qui marque plus que son éloquence, c'est son amour des hommes. Ce qui touche plus que son érudition, c'est sa passion inébranlable pour Jésus-Christ et pour Son Église.

En 2019, Dieu m'a accordé le privilège de faire personnellement sa connaissance ici, à Paris. Cette rencontre a profondément marqué ma vie. J'ai découvert un homme d'une simplicité désarmante, d'une disponibilité rare, toujours prêt à écouter, à conseiller et à encourager. Depuis ce jour, malgré les milliers de kilomètres qui nous séparent, puisqu'il réside en Floride, notre communion fraternelle n'a jamais cessé de grandir.

Nos échanges sur l'Église, la foi, la société et les défis de notre temps ont été pour moi une véritable école. J'y ai trouvé non seulement un interlocuteur brillant, mais également un frère et un homme de Dieu dont la sagesse est constamment éclairée par les Écritures.

Samuel Louis-Jean est un serviteur de Dieu dans toute la noblesse du terme. Sa connaissance approfondie de la Parole, son sens remarquable de la communication, son éloquence naturelle et sa capacité à transmettre les vérités bibliques avec profondeur et simplicité font de lui un orateur d'exception. Mais au-delà de ses qualités intellectuelles, c'est son cœur pastoral qui fait toute la différence.

Voilà pourquoi, son dernier titre "J'aime mon Église" n'est pas un livre de plus sur l'Église. C'est le cri du cœur d'un homme qui la connaît, qui la sert, qui souffre avec elle et qui refuse de la voir affaiblie par l'indifférence, les divisions ou les préjugés. Chaque page porte la marque d'une expérience vécue, d'une réflexion mûrie dans la prière et d'un amour authentique pour le Corps de Christ.

Dans un monde où beaucoup critiquent l'Église sans vraiment la connaître, Samuel Louis-Jean nous invite à changer de regard. Il nous rappelle que l'Église demeure le projet de Dieu, l'Épouse de Christ et l'espérance du monde. L'aimer n'est pas une option ; c'est une responsabilité spirituelle (1 Cor. 6:19-20).

Dr. Louis-Jean,
Recevez ici l'expression de ma profonde admiration et de ma sincère gratitude. Merci pour votre fidélité au Seigneur, votre intégrité, votre enseignement et votre engagement sans relâche au service de l'Évangile de Jésus-Christ. Merci également pour tout ce que j'ai appris à vos côtés, au fil de nos échanges fraternels, souvent riches, toujours édifiants.

Puisse cette œuvre toucher des milliers de vies, réveiller des consciences, restaurer l'amour de l'Église dans le cœur des croyants et contribuer à l'avancement du Royaume de Dieu, pour la seule gloire de Jésus-Christ.`,
        locale: 'fr',
        isFeatured: true,
        isPublished: true,
        displayOrder: 1,
      },
    ];

    for (const testimonial of testimonials) {
      await Testimonial.create(testimonial);
    }
    console.log('✅ Testimonials created');

    // Create FAQs
    console.log('❓ Creating FAQs...');
    const faqs = [
      {
        question: 'How can I purchase books?',
        answer: 'You can purchase books directly through our website. Simply add books to your cart and complete the checkout process. We\'ll contact you with payment and shipping details.',
        category: 'Purchasing',
        displayOrder: 1,
        isPublished: true,
      },
      {
        question: 'What is the special four-book offer?',
        answer: 'Our special offer allows you to purchase all four books for $100 plus shipping—a savings compared to purchasing each book individually at $25. This offer can be selected during checkout.',
        category: 'Purchasing',
        displayOrder: 2,
        isPublished: true,
      },
      {
        question: 'How do I book Dr. Jean for a speaking engagement?',
        answer: 'Visit our Booking page and complete the request form. Provide details about your event, and we\'ll contact you to discuss availability and arrangements.',
        category: 'Speaking',
        displayOrder: 3,
        isPublished: true,
      },
      {
        question: 'What types of events does Dr. Jean speak at?',
        answer: 'Dr. Jean speaks at conferences, churches, educational institutions, corporate events, and community gatherings. His messages are tailored to resonate with diverse audiences.',
        category: 'Speaking',
        displayOrder: 4,
        isPublished: true,
      },
      {
        question: 'How long does shipping take?',
        answer: 'Shipping times vary based on location. We typically process orders within 2-3 business days, with delivery taking an additional 5-7 business days for domestic orders.',
        category: 'Shipping',
        displayOrder: 5,
        isPublished: true,
      },
    ];

    for (const faq of faqs) {
      await FAQ.create(faq);
    }
    console.log('✅ FAQs created');

    console.log('✅ Database seed completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   Admin Email: ${process.env.ADMIN_EMAIL || 'admin@samuellouis jean.com'}`);
    console.log(`   Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
    console.log('\n🚀 You can now start the development server with: npm run dev');
    console.log('🔐 Access admin panel at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
