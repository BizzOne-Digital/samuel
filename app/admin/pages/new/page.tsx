import { redirect } from 'next/navigation';

export default function NewPagePage() {
  redirect('/admin/pages/new/edit');
}
