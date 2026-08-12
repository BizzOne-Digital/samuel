'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ArrowLeft, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export default function AdminFAQsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFaqs(faqs.filter((faq) => faq._id !== id));
        alert('FAQ deleted successfully');
      } else {
        alert('Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Error deleting FAQ');
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

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc: any, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
                <h1 className="text-3xl font-bold text-gray-900">Manage FAQs</h1>
                <p className="text-gray-600 mt-1">{faqs.length} FAQs total</p>
              </div>
            </div>
            <Link
              href="/admin/faqs/new"
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New FAQ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first FAQ</p>
            <Link
              href="/admin/faqs/new"
              className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New FAQ
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(faqsByCategory).map(([category, categoryFaqs]: [string, any]) => (
              <div key={category} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-emerald-700">
                  {category}
                </h2>
                <div className="space-y-4">
                  {categoryFaqs.map((faq: FAQ) => (
                    <div
                      key={faq._id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-600 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {faq.question}
                            </h3>
                            {!faq.isPublished && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {faq.answer}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          <Link
                            href={`/admin/faqs/${faq._id}/edit`}
                            className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(faq._id)}
                            className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
