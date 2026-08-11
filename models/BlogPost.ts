import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogContentSection {
  _id?: string;
  type: 'text' | 'image' | 'quote' | 'list';
  content: string;
  image?: string;
  imageAlt?: string;
  displayOrder: number;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  coverImageAlt?: string;
  author: string;
  category?: string;
  tags: string[];
  contentSections: IBlogContentSection[];
  readingTime?: number;
  isDraft: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  
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

const BlogContentSectionSchema = new Schema<IBlogContentSection>({
  type: {
    type: String,
    enum: ['text', 'image', 'quote', 'list'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: String,
  imageAlt: String,
  displayOrder: {
    type: Number,
    default: 0,
  },
});

const BlogPostSchema = new Schema<IBlogPost>(
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
    excerpt: {
      type: String,
      required: true,
    },
    coverImage: String,
    coverImageAlt: String,
    author: {
      type: String,
      default: 'Dr. Samuel Louis Jean',
    },
    category: String,
    tags: [String],
    contentSections: [BlogContentSectionSchema],
    readingTime: Number,
    isDraft: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    
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
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ isDraft: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
