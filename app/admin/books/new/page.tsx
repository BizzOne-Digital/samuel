import { redirect } from 'next/navigation';

export default function NewBookPage() {
  redirect('/admin/books/new/edit');
}
