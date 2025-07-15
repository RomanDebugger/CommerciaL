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
  ChevronRight,
  Edit3
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
  const [loading, setLoading] = useState({
    profile: true,
    metrics: true
  });
  const [metrics, setMetrics] = useState([
    { title: 'Total Sales', value: '-', icon: <IndianRupee className="w-5 h-5" />, color: 'text-green-500' },
    { title: 'Orders', value: '-', icon: <ShoppingCart className="w-5 h-5" />, color: 'text-blue-500' },
    { title: 'Products', value: '-', icon: <Package className="w-5 h-5" />, color: 'text-purple-500' },
    { title: 'Revenue', value: '-', icon: <BarChart3 className="w-5 h-5" />, color: 'text-yellow-500' },
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
            icon: <IndianRupee className="w-5 h-5" />,
            color: 'text-green-500'
          },
          {
            title: 'Orders',
            value: data.totalOrders,
            icon: <ShoppingCart className="w-5 h-5" />,
            color: 'text-blue-500'
          },
          {
            title: 'Products',
            value: data.totalProducts,
            icon: <Package className="w-5 h-5" />,
            color: 'text-purple-500'
          },
          {
            title: 'Revenue',
            value: `₹${data.totalRevenue.toLocaleString()}`,
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'text-yellow-500'
          },
        ]);
      } catch {
        toast.error('Failed to fetch analytics');
      } finally {
        setLoading(prev => ({ ...prev, metrics: false }));
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
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };

    fetchAnalytics();
    fetchSellerProfile();
  }, []);

  // Custom loading skeleton component
  const LoadingSkeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121826] dark:text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {loading.profile ? (
              <>
                <LoadingSkeleton className="h-8 w-48 mb-2" />
                <LoadingSkeleton className="h-4 w-64" />
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome Back, {seller?.shopName || user?.email || 'Seller'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Here is your store performance overview
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => router.push('/seller/products')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
          >
            Manage Products <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.title}
                </h3>
                <div className={`p-2 rounded-full ${metric.color} bg-opacity-20`}>
                  {metric.icon}
                </div>
              </div>
              {loading.metrics ? (
                <LoadingSkeleton className="h-7 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-semibold mt-2">
                  {metric.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Shop Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Shop Profile</h3>
            <button
              onClick={() => router.push('/seller/profile')}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          </div>
          
          <div className="p-4 md:p-6">
            {loading.profile ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <LoadingSkeleton className="h-4 w-24" />
                    <LoadingSkeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            ) : seller ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shop Name</p>
                  <p className="font-medium">{seller.shopName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GST Number</p>
                  <p className="font-medium">{seller.gstNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Email</p>
                  <p className="font-medium">{seller.contactEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium">{seller.contactPhone}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium">{seller.address}, {seller.pincode}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {seller.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Failed to load profile data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}