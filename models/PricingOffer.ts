import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPricingOffer extends Document {
  name: string;
  offerType: 'single_book' | 'multi_book' | 'special';
  quantity: number;
  price: number; // stored in cents
  label: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PricingOfferSchema = new Schema<IPricingOffer>(
  {
    name: {
      type: String,
      required: true,
    },
    offerType: {
      type: String,
      enum: ['single_book', 'multi_book', 'special'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: String,
    startDate: Date,
    endDate: Date,
    isActive: {
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
PricingOfferSchema.index({ isActive: 1, displayOrder: 1 });

const PricingOffer: Model<IPricingOffer> =
  mongoose.models.PricingOffer || mongoose.model<IPricingOffer>('PricingOffer', PricingOfferSchema);

export default PricingOffer;
