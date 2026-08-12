import connectDB from './db/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function getSettings() {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  return JSON.parse(JSON.stringify(settings));
}
