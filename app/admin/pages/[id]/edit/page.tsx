'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Section {
  _id?: string;
  sectionName: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  image?: string;
  imageAlt?: string;
  backgroundImage?: string;
  alignment?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark' | 'cream' | 'midnight';
  isVisible: boolean;
  displayOrder: number;
}

export default function EditPagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    pageKey: '',
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: true,
    sections: [] as Section[],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    console.log('Page ID:', pageId);
    if (pageId && pageId !== 'new') {
      fetchPage();
    } else {
      setLoading(false);
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      setError(null);
      console.log('Fetching page:', pageId);
      const response = await fetch(`/api/admin/pages/${pageId}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch page');
      }
      
      const data = await response.json();
      console.log('Fetched page data:', data);
      
      setFormData({
        pageKey: data.pageKey || '',
        title: data.title || '',
        slug: data.slug || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        isPublished: data.isPublished ?? true,
        sections: data.sections || [],
      });
    } catch (error: any) {
      console.error('Error fetching page:', error);
      setError(error.message || 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = pageId === 'new' 
        ? '/api/admin/pages' 
        : `/api/admin/pages/${pageId}`;
      
      const method = pageId === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Page saved successfully!');
        router.push('/admin/pages');
      } else {
        alert('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, slug: `/${slug}` }));
  };

  const addSection = () => {
    const newSection: Section = {
      sectionName: 'New Section',
      heading: '',
      body: '',
      isVisible: true,
      displayOrder: formData.sections.length,
      theme: 'light',
      alignment: 'center',
    };
    setFormData((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const removeSection = (index: number) => {
    if (confirm('Are you sure you want to remove this section?')) {
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.filter((_, i) => i !== index),
      }));
    }
  };

  const updateSection = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...formData.sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((section, i) => {
      section.displayOrder = i;
    });
    setFormData((prev) => ({ ...prev, sections: newSections }));
  };

  const moveSectionDown = (index: number) => {
    if (index === formData.sections.length - 1) return;
    const newSections = [...formData.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    newSections.forEach((section, i) => {
      section.displayOrder = i;
    });
    setFormData((prev) => ({ ...prev, sections: newSections }));
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Link href="/admin/pages" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Page</h1>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Page</h2>
            <p className="text-red-700">{error}</p>
            <Link href="/admin/pages" className="mt-4 inline-block px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
              Back to Pages
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link href="/admin/pages" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {pageId === 'new' ? 'Add New Page' : 'Edit Page'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Page Details */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Page Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Page Key *</label>
                <input
                  type="text"
                  name="pageKey"
                  value={formData.pageKey}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                  placeholder="e.g., home, about, contact"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Page Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Slug *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label className="ml-3 text-sm font-semibold text-gray-900">Published</label>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Page Sections</h2>
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Section
              </button>
            </div>

            {formData.sections.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600 mb-4">No sections yet. Add your first section.</p>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
                >
                  Add First Section
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.sections.map((section, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <input
                        type="text"
                        value={section.sectionName}
                        onChange={(e) => updateSection(index, 'sectionName', e.target.value)}
                        className="text-lg font-semibold px-2 py-1 border-b-2 border-transparent hover:border-emerald-600 focus:border-emerald-600 focus:outline-none bg-transparent"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateSection(index, 'isVisible', !section.isVisible)}
                          className={`p-2 rounded-lg ${section.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}
                        >
                          {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button type="button" onClick={() => moveSectionUp(index)} disabled={index === 0} className="p-2 bg-gray-200 rounded-lg disabled:opacity-30">
                          <ChevronUp size={18} />
                        </button>
                        <button type="button" onClick={() => moveSectionDown(index)} disabled={index === formData.sections.length - 1} className="p-2 bg-gray-200 rounded-lg disabled:opacity-30">
                          <ChevronDown size={18} />
                        </button>
                        <button type="button" onClick={() => removeSection(index)} className="p-2 bg-red-100 text-red-700 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Eyebrow</label>
                        <input type="text" value={section.eyebrow || ''} onChange={(e) => updateSection(index, 'eyebrow', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Small text above heading" />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold mb-1">Theme</label>
                        <select value={section.theme || 'light'} onChange={(e) => updateSection(index, 'theme', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="cream">Cream</option>
                          <option value="midnight">Midnight</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold mb-1">Heading</label>
                        <input type="text" value={section.heading || ''} onChange={(e) => updateSection(index, 'heading', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold mb-1">Body</label>
                        <textarea value={section.body || ''} onChange={(e) => updateSection(index, 'body', e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Background Image</label>
                        <input type="text" value={section.backgroundImage || ''} onChange={(e) => updateSection(index, 'backgroundImage', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="/hero-bg.png" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Alignment</label>
                        <select value={section.alignment || 'center'} onChange={(e) => updateSection(index, 'alignment', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Page
                  </>
                )}
              </button>
              <Link href="/admin/pages" className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg flex items-center justify-center">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
