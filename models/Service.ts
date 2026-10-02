import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceDetailSection {
  _id?: string;
  sectionType: 'overview' | 'benefits' | 'audience' | 'process' | 'features' | 'gallery' | 'faqs' | 'custom';
  heading?: string;
  content?: string;
  items?: string[];
  image?: string;
  imageAlt?: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface IService extends Document {
  // Listing Information
  title: string;
  slug: string;
  shortDescription: string;
  mainImage?: string;
  imageAlt?: string;
  icon?: string;
  ctaLabel: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  
  // Detail Page Information
  hero: {
    eyebrow?: string;
    title?: string;
    description?: string;
    backgroundImage?: string;
  };
  detailSections: IServiceDetailSection[];
  closingCta?: {
    heading?: string;
    description?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  socialImage?: string;
  
  locale: string;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceDetailSectionSchema = new Schema<IServiceDetailSection>({
  sectionType: {
    type: String,
    enum: ['overview', 'benefits', 'audience', 'process', 'features', 'gallery', 'faqs', 'custom'],
    required: true,
  },
  heading: String,
  content: String,
  items: [String],
  image: String,
  imageAlt: String,
  displayOrder: {
    type: Number,
    default: 0,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

const ServiceSchema = new Schema<IService>(
  {
    // Listing Information
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    mainImage: String,
    imageAlt: String,
    icon: String,
    ctaLabel: {
      type: String,
      default: 'Learn More',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    
    // Detail Page Information
    hero: {
      eyebrow: String,
      title: String,
      description: String,
      backgroundImage: String,
    },
    detailSections: [ServiceDetailSectionSchema],
    closingCta: {
      heading: String,
      description: String,
      ctaLabel: String,
      ctaUrl: String,
    },
    
    // SEO
    metaTitle: String,
    metaDescription: String,
    socialImage: String,
    
    locale: {
      type: String,
      default: 'en',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ displayOrder: 1 });
ServiceSchema.index({ isPublished: 1, isFeatured: 1 });

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
