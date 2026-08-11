import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookingRequest extends Document {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  eventType: string;
  eventDate?: Date;
  eventLocation?: string;
  audienceSize?: string;
  budgetRange?: string;
  eventDetails: string;
  preferredContact: 'email' | 'phone';
  status: 'pending' | 'contacted' | 'confirmed' | 'declined' | 'completed';
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingRequestSchema = new Schema<IBookingRequest>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    organization: String,
    eventType: {
      type: String,
      required: true,
    },
    eventDate: Date,
    eventLocation: String,
    audienceSize: String,
    budgetRange: String,
    eventDetails: {
      type: String,
      required: true,
    },
    preferredContact: {
      type: String,
      enum: ['email', 'phone'],
      default: 'email',
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'confirmed', 'declined', 'completed'],
      default: 'pending',
    },
    internalNotes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
BookingRequestSchema.index({ status: 1, createdAt: -1 });
BookingRequestSchema.index({ email: 1 });

const BookingRequest: Model<IBookingRequest> =
  mongoose.models.BookingRequest || mongoose.model<IBookingRequest>('BookingRequest', BookingRequestSchema);

export default BookingRequest;
