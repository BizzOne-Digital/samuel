import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryImage extends Document {
  categoryId: mongoose.Types.ObjectId;
  url: string;
  caption?: string;
  alt: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'GalleryCategory',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    caption: String,
    alt: {
      type: String,
      required: true,
    },
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
  },
  {
    timestamps: true,
  }
);

// Indexes
GalleryImageSchema.index({ categoryId: 1, displayOrder: 1 });
GalleryImageSchema.index({ isFeatured: 1, isPublished: 1 });

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);

export default GalleryImage;
