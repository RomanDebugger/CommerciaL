'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type SellerForm = {
  shopName: string;
  gstNumber: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  pincode: string;
  rating: string;
};

const initialForm: SellerForm = {
  shopName: '',
  gstNumber: '',
  description: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  pincode: '',
  rating: '',
};

export default function SellerProfilePage() {
  const [form, setForm] = useState<SellerForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/seller/profile');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setForm({
          shopName: data.shopName || '',
          gstNumber: data.gstNumber || '',
          description: data.description || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          pincode: data.pincode || '',
          rating: data.rating?.toString() || '',
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (key: keyof SellerForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/seller/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rating: parseFloat(form.rating) || null,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success('Profile updated successfully!', {
        style: { background: '#4BB543', color: '#fff' },
        iconTheme: { primary: '#fff', secondary: '#4BB543' },
      });
    } catch {
      toast.error('Update failed. Please try again.', {
        style: { background: '#FF3333', color: '#fff' },
        iconTheme: { primary: '#fff', secondary: '#FF3333' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seller Profile</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Manage your shop information</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {([
              ['Shop Name', 'shopName', 'text', 'My Awesome Shop'],
              ['GST Number', 'gstNumber', 'text', '22AAAAA0000A1Z5'],
              ['Contact Email', 'contactEmail', 'email', 'contact@shop.com'],
              ['Contact Phone', 'contactPhone', 'tel', '+91 9876543210'],
            ] as const).map(([label, key, type, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shop Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Business Street, City"
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="110001"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => handleChange('rating', e.target.value)}
                placeholder="4.5"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition appearance-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shop Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell customers about your shop..."
              rows={4}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3 px-4 bg-gr1 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 ease-in-out ${
              submitting ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`} 
          >
            {submitting ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
