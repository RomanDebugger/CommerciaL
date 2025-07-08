'use client';
import React from 'react';
import { BarChart3, Package, ShoppingCart, PlusCircle, IndianRupee, Activity } from 'lucide-react';
import {useSessionStore} from '@/app/store/useSessionStore';
import { useRouter } from 'next/navigation';

const metrics = [
  {
    title: 'Total Sales',
    value: '₹48,200',
    icon: <IndianRupee className="w-5 h-5 text-green-500" />,
  },
  {
    title: 'Orders',
    value: '312',
    icon: <ShoppingCart className="w-5 h-5 text-blue-500" />,
  },
  {
    title: 'Products',
    value: '27',
    icon: <Package className="w-5 h-5 text-purple-500" />,
  },
  {
    title: 'Revenue',
    value: '₹1.2L',
    icon: <BarChart3 className="w-5 h-5 text-yellow-500" />,
  },
];

export default function SellerHome() {
const { user } = useSessionStore();
const router = useRouter();
  return (
    <div className="flex min-h-screen bg-[#121826] text-white">
      <div className="flex-1 flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome Back, {user?.email || 'Seller'}</h1>
            <p className="text-gray-400 text-sm mt-1">Here’s an overview of your store performance.</p>
          </div>
          <button 
          className="flex items-center gap-2 bg-gradient-to-tr from-gr1 via-gr2 to-gr3 px-4 py-2 rounded-full text-sm hover:from-gr3 hover:to-gr1 transition"
          onClick={()=>router.push('/seller/products')}>
            Your Products
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="bg-[#1f2937] rounded-xl p-4 shadow-md flex flex-col space-y-2 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-400">{metric.title}</h2>
                {metric.icon}
              </div>
              <p className="text-xl font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1f2937] rounded-xl p-6 mt-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>📦 Order #1298 was shipped to New Delhi</li>
            <li>🎉 New product "Air Max Shoes" added to your store</li>
            <li>💰 ₹2,300 received from Order #1287</li>
            <li>📦 Order #1285 returned by customer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
