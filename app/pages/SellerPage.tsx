'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Package,
  ShoppingCart,
  IndianRupee,
} from 'lucide-react';

interface SellerProfile {
  shopName: string;
  gstNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  pincode: string;
  description: string;
}

export default function SellerHome() {
  const { user } = useSessionStore();
  const router = useRouter();

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [metrics, setMetrics] = useState([
    { title: 'Total Sales', value: '-', icon: <IndianRupee className="w-5 h-5 text-green-500" /> },
    { title: 'Orders', value: '-', icon: <ShoppingCart className="w-5 h-5 text-blue-500" /> },
    { title: 'Products', value: '-', icon: <Package className="w-5 h-5 text-purple-500" /> },
    { title: 'Revenue', value: '-', icon: <BarChart3 className="w-5 h-5 text-yellow-500" /> },
  ]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/seller/analytics');
        if (!res.ok) throw new Error();
        const data = await res.json();

        setMetrics([
          {
            title: 'Total Sales',
            value: `₹${data.totalSales.toLocaleString()}`,
            icon: <IndianRupee className="w-5 h-5 text-green-500" />,
          },
          {
            title: 'Orders',
            value: data.totalOrders,
            icon: <ShoppingCart className="w-5 h-5 text-blue-500" />,
          },
          {
            title: 'Products',
            value: data.totalProducts,
            icon: <Package className="w-5 h-5 text-purple-500" />,
          },
          {
            title: 'Revenue',
            value: `₹${data.totalRevenue.toLocaleString()}`,
            icon: <BarChart3 className="w-5 h-5 text-yellow-500" />,
          },
        ]);
      } catch {
        toast.error('Failed to fetch analytics');
      }
    };

    const fetchSellerProfile = async () => {
      try {
        const res = await fetch('/api/seller/profile');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSeller(data);
      } catch {
        toast.error('Failed to load seller profile');
      }
    };

    fetchAnalytics();
    fetchSellerProfile();
  }, []);

  return (
    <div className="flex min-h-screen dark:bg-[#121826] dark:text-white">
      <div className="flex-1 flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between flex-col md:flex-row gap-6">
          <div>
            <h1 className="text-2xl font-semibold">Welcome Back, {seller?.shopName ||user?.email || 'Seller'}</h1>
            <p className="text-gray-700 dark:text-gray-400 text-sm mt-1">
              Here is an overview of your store performance.
            </p>
          </div>
          <button
            className="flex text-white items-center gap-2 bg-gradient-to-tr from-gr1 via-gr2 to-gr3 px-4 py-2 rounded-full text-sm hover:from-gr3 hover:to-gr1 transition"
            onClick={() => router.push('/seller/products')}
          >
            Your Products
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="bg-gray-200 dark:bg-[#1f2937] rounded-xl p-4 shadow-md flex flex-col space-y-2 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium dark:text-gray-400">{metric.title}</h2>
                {metric.icon}
              </div>
              <p className="text-xl font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 mt-6 shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Shop</h3>
          {seller ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-medium">Shop Name</p>
                <p>{seller.shopName}</p>
              </div>
              <div>
                <p className="font-medium">GST Number</p>
                <p>{seller.gstNumber}</p>
              </div>
              <div>
                <p className="font-medium">Contact Email</p>
                <p>{seller.contactEmail}</p>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p>{seller.contactPhone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-medium">Address</p>
                <p>{seller.address}, {seller.pincode}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-medium">Description</p>
                <p>{seller.description || 'No description yet.'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading profile...</p>
          )}

          <button
            onClick={() => router.push('/seller/profile')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
          >
            Edit Shop Profile
          </button>
        </div>
      </div>
    </div>
  );
}
