import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getAdminSession } from '@/lib/admin-auth';
import { revalidatePublicPages } from '@/lib/revalidate-public';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
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
    const session = await getAdminSession();
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

    revalidatePublicPages();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
