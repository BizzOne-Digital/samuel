'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Users, FileText, Settings, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
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

  const menuItems = [
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      href: '/admin/orders',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Books',
      description: 'Manage books, pricing, and inventory',
      href: '/admin/books',
      icon: BookOpen,
      color: 'emerald',
    },
    {
      title: 'Pages',
      description: 'Edit website pages and content',
      href: '/admin/pages',
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'FAQs',
      description: 'Manage frequently asked questions',
      href: '/admin/faqs',
      icon: FileText,
      color: 'purple',
    },
    {
      title: 'Testimonials',
      description: 'Manage customer testimonials',
      href: '/admin/testimonials',
      icon: Users,
      color: 'orange',
    },
    {
      title: 'Contact Messages',
      description: 'View and respond to messages',
      href: '/admin/messages',
      icon: Mail,
      color: 'blue',
    },
    {
      title: 'Settings',
      description: 'Site settings and configuration',
      href: '/admin/settings',
      icon: Settings,
      color: 'gray',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {session.user?.name}</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-emerald-500"
              >
                <div className="flex items-start">
                  <div className={`p-3 bg-${item.color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
