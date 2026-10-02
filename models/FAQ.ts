import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  isPublished: boolean;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: String,
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
FAQSchema.index({ displayOrder: 1 });
FAQSchema.index({ category: 1, displayOrder: 1 });

const FAQ: Model<IFAQ> =
  mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);

export default FAQ;
