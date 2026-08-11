import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isPublished: boolean;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryCategorySchema = new Schema<IGalleryCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    displayOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    locale: {
      type: String,
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
GalleryCategorySchema.index({ slug: 1 });
GalleryCategorySchema.index({ displayOrder: 1 });

const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory || mongoose.model<IGalleryCategory>('GalleryCategory', GalleryCategorySchema);

export default GalleryCategory;
