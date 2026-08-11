import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageSection {
  _id?: string;
  sectionName: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  image?: string;
  imageAlt?: string;
  backgroundImage?: string;
  mobileImage?: string;
  alignment?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark' | 'cream' | 'midnight';
  isVisible: boolean;
  displayOrder: number;
}

export interface IPage extends Document {
  pageKey: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  socialImage?: string;
  sections: IPageSection[];
  isPublished: boolean;
  locale: string;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PageSectionSchema = new Schema<IPageSection>({
  sectionName: {
    type: String,
    required: true,
  },
  eyebrow: String,
  heading: String,
  subheading: String,
  body: String,
  primaryCtaLabel: String,
  primaryCtaUrl: String,
  secondaryCtaLabel: String,
  secondaryCtaUrl: String,
  image: String,
  imageAlt: String,
  backgroundImage: String,
  mobileImage: String,
  alignment: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'center',
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'cream', 'midnight'],
    default: 'dark',
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
});

const PageSchema = new Schema<IPage>(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    metaTitle: String,
    metaDescription: String,
    socialImage: String,
    sections: [PageSectionSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
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
PageSchema.index({ pageKey: 1, locale: 1 });
PageSchema.index({ slug: 1 });

const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;
