import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
}

export interface IContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  mapUrl?: string;
  hours?: string;
}

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultSocialImage?: string;
  contact: IContactInfo;
  social: ISocialLinks;
  footer: {
    description: string;
    copyrightText: string;
    newsletterText: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  localization: {
    defaultLanguage: string;
    enabledLanguages: string[];
  };
  commerce: {
    currency: string;
    shippingMessage: string;
    defaultShippingCharge: number;
    freeShippingThreshold?: number;
    checkoutInstructions: string;
    paymentMethodText: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: 'Samuel Louis Jean Publications',
    },
    tagline: {
      type: String,
      default: 'Words That Inspire. Ideas That Transform.',
    },
    logo: String,
    favicon: String,
    defaultSeoTitle: {
      type: String,
      default: 'Samuel Louis Jean Publications - Author & Speaker',
    },
    defaultSeoDescription: {
      type: String,
      default: 'Discover the books, conferences, and message of Dr. Samuel Louis Jean.',
    },
    defaultSocialImage: String,
    contact: {
      email: {
        type: String,
        required: true,
        default: 'dr.louisjean@yahoo.com',
      },
      phone: {
        type: String,
        required: true,
        default: '904-444-3061',
      },
      address: {
        type: String,
        required: true,
        default: '1615 Night Owl Trail',
      },
      city: {
        type: String,
        default: 'Middleburg',
      },
      state: {
        type: String,
        default: 'FL',
      },
      zip: {
        type: String,
        default: '32068',
      },
      mapUrl: String,
      hours: String,
    },
    social: {
      facebook: String,
      instagram: String,
      youtube: String,
      linkedin: String,
      twitter: String,
    },
    footer: {
      description: {
        type: String,
        default: 'Inspiring meaningful growth through powerful words and transformative ideas.',
      },
      copyrightText: {
        type: String,
        default: '© 2026 Samuel Louis Jean Publications. All rights reserved.',
      },
      newsletterText: {
        type: String,
        default: 'Stay updated with the latest books, events, and messages.',
      },
      ctaText: String,
      ctaUrl: String,
    },
    localization: {
      defaultLanguage: {
        type: String,
        default: 'en',
      },
      enabledLanguages: {
        type: [String],
        default: ['en', 'fr', 'ht'],
      },
    },
    commerce: {
      currency: {
        type: String,
        default: 'USD',
      },
      shippingMessage: {
        type: String,
        default: 'Shipping charges calculated at checkout',
      },
      defaultShippingCharge: {
        type: Number,
        default: 5.00,
      },
      freeShippingThreshold: Number,
      checkoutInstructions: {
        type: String,
        default: 'Please complete your order details below. We will contact you to arrange payment and confirm shipping.',
      },
      paymentMethodText: {
        type: String,
        default: 'Payment instructions will be sent via email',
      },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
