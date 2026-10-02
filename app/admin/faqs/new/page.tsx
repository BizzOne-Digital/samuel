import { redirect } from 'next/navigation';

export default function NewFAQPage() {
  redirect('/admin/faqs/new/edit');
}
