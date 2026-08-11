import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBook extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  author: string;
  shortDescription: string;
  fullDescription?: string;
  coverImage?: string;
  coverImageAlt?: string;
  additionalImages?: Array<{
    url: string;
    alt?: string;
  }>;
  price: number; // stored in cents
  salePrice?: number; // stored in cents
  isSaleActive: boolean;
  format?: string;
  isbn?: string;
  pageCount?: number;
  publicationDate?: Date;
  inStock: boolean;
  stockQuantity?: number;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  category?: string;
  tags?: string[];
  
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

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    subtitle: String,
    author: {
      type: String,
      default: 'Dr. Samuel Louis Jean',
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: String,
    coverImage: String,
    coverImageAlt: String,
    additionalImages: [{
      url: String,
      alt: String,
    }],
    price: {
      type: Number,
      required: true,
      default: 2500, // $25.00 in cents
    },
    salePrice: Number,
    isSaleActive: {
      type: Boolean,
      default: false,
    },
    format: String,
    isbn: String,
    pageCount: Number,
    publicationDate: Date,
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: Number,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    category: String,
    tags: [String],
    
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
BookSchema.index({ slug: 1 });
BookSchema.index({ displayOrder: 1 });
BookSchema.index({ isPublished: 1, isFeatured: 1 });
BookSchema.index({ category: 1 });

const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
