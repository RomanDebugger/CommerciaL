'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type BuyerForm = {
  fullName: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  address: string;
  pincode: string;
};

const initialForm: BuyerForm = {
  fullName: '',
  phoneNumber: '',
  gender: '',
  dob: '',
  address: '',
  pincode: '',
};

export default function BuyerProfilePage() {
  const [form, setForm] = useState<BuyerForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/buyer/profile');
        if (!res.ok) throw new Error();
        const data = await res.json();

        setForm({
          fullName: data.fullName || '',
          phoneNumber: data.phoneNumber || '',
          gender: data.gender || '',
          dob: data.dob ? data.dob.slice(0, 10) : '',
          address: data.address || '',
          pincode: data.pincode || '',
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (key: keyof BuyerForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/buyer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dob: form.dob || null,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Update failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Update your personal information
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden p-6 space-y-6">
          {([
            ['Full Name', 'fullName', 'text', 'John Doe'],
            ['Phone Number', 'phoneNumber', 'tel', '+91 9876543210'],
            ['Date of Birth', 'dob', 'date', ''],
            ['Address', 'address', 'text', '123, Sector 9, Gurgaon'],
            ['Pincode', 'pincode', 'text', '122001'],
          ] as const).map(([label, key, type, placeholder]) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="block w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-gr2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
              />
            </div>
          ))}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="block w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-gr2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3 px-4 bg-gr1 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 ease-in-out focus:outline-none ${
              submitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Your information is secure with us</p>
        </div>
      </div>
    </div>
  );
}
