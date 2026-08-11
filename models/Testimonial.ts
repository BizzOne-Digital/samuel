import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  personName: string;
  role: string;
  organization?: string;
  quote: string;
  image?: string;
  imageAlt?: string;
  rating?: number;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    personName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    organization: String,
    quote: {
      type: String,
      required: true,
    },
    image: String,
    imageAlt: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
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
TestimonialSchema.index({ displayOrder: 1 });
TestimonialSchema.index({ isFeatured: 1, isPublished: 1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
