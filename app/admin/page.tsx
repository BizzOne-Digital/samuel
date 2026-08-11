import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to admin dashboard or login
  redirect('/admin/dashboard');
}
