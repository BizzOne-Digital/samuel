import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({
        siteName: 'Samuel Louis Jean Publications',
        tagline: 'Words That Inspire. Ideas That Transform.',
        contact: {
          email: 'dr.louisjean@yahoo.com',
          phone: '904-444-3061',
          address: '922 Blanding Blvd',
          city: 'Orange Park',
          state: 'FL',
          zip: '32065',
        },
        footer: {
          description: 'Inspiring meaningful growth through powerful words and transformative ideas.',
          copyrightText: '© 2026 Samuel Louis Jean Publications. All rights reserved.',
          newsletterText: 'Stay updated with the latest books, events, and inspiring messages.',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    let settings = await SiteSettings.findOne();
    
    if (settings) {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      settings = await SiteSettings.create(data);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
