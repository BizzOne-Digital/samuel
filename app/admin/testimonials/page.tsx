'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ArrowLeft, MessageSquare, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Testimonial {
  _id: string;
  personName: string;
  role?: string;
  organization?: string;
  quote: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

export default function AdminTestimonialsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTestimonials(testimonials.filter((t) => t._id !== id));
        alert('Testimonial deleted successfully');
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
                <p className="text-gray-600 mt-1">{testimonials.length} testimonials total</p>
              </div>
            </div>
            <Link
              href="/admin/testimonials/new"
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Testimonial
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first testimonial</p>
            <Link
              href="/admin/testimonials/new"
              className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Testimonial
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {testimonial.personName}
                      </h3>
                      {testimonial.isFeatured && (
                        <span className="px-3 py-1 bg-gold/20 text-gold-800 text-xs font-semibold rounded-full flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      )}
                      {!testimonial.isPublished && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                    
                    {(testimonial.role || testimonial.organization) && (
                      <p className="text-sm text-gray-600 mb-3">
                        {testimonial.role}
                        {testimonial.role && testimonial.organization && ', '}
                        {testimonial.organization}
                      </p>
                    )}
                    
                    <p className="text-gray-700 italic line-clamp-3">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/testimonials/${testimonial._id}/edit`}
                      className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
