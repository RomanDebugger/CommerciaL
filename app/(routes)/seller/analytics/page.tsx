'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
  LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#10b981', '#f97316', '#ef4444', '#eab308'];

const currency = (val: number) => `₹${val.toLocaleString()}`;

export default function SellerAnalyticsPage() {
  type EarningsData = { date: string; total: number };
  type ProductData = { name: string; sold: number };

  const [daily, setDaily] = useState<EarningsData[]>([]);
  const [monthly, setMonthly] = useState<EarningsData[]>([]);
  const [yearly, setYearly] = useState<EarningsData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
 const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/seller/analytics/extended');
        const data = await res.json();
        setDaily(data.dailyEarnings || []);
        setMonthly(data.monthlyEarnings || []);
        setYearly(data.yearlyEarnings || []);
        setTopProducts(data.topProducts || []);
      } catch {
        toast.error('Failed to fetch analytics.');
      }
    };

    fetchAnalytics();
  }, []);
  
    useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update(); 
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    }, []);
    
  const totalEarnings = daily.reduce((sum, d) => sum + d.total, 0);
  const avgPerDay = daily.length > 0 ? totalEarnings / daily.length : 0;
  const topProduct = topProducts[0]?.name || 'N/A';

  return (
    <div className="min-h-screen p-6 dark:bg-[#121826] text-white space-y-8">
      <h1 className="text-3xl font-bold">📊 Seller Analytics Dashboard</h1>

      <div className="bg-[#1f2937] p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">📆 Daily Earnings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(val) => currency(Number(val))} />
            <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
        <div className="space-y-4">
          <div className="bg-[#1f2937] p-4 rounded-xl text-center">
            <p className="text-sm text-gray-400">Total Earnings</p>
            <h2 className="text-xl font-bold">{currency(totalEarnings)}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-xl text-center">
            <p className="text-sm text-gray-400">Average per Day</p>
            <h2 className="text-xl font-bold">{currency(avgPerDay)}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-xl text-center">
            <p className="text-sm text-gray-400">Top Product</p>
            <h2 className="text-xl font-bold">{topProduct}</h2>
          </div>
        </div>
        <div className="bg-[#1f2937] p-6 rounded-xl overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">📅 Monthly Earnings</h3>
        <div className="w-full aspect-[16/9]">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly}>
                <defs>
                <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                </defs>
                <XAxis dataKey="date" interval="preserveStartEnd" angle={-15} textAnchor="end" height={40} />
                <YAxis />
                <Tooltip formatter={(val) => currency(Number(val))} />
                <CartesianGrid strokeDasharray="3 3" />
                <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorMonthly)" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
        </div>
        <div className="bg-[#1f2937] p-6 rounded-xl overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">📈 Yearly Earnings</h3>
        <div className="w-full aspect-[16/9]">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearly}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(val) => currency(Number(val))} />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#1f2937] p-6 rounded-xl overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">🏆 Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                <PieChart>
                <Pie
                    data={topProducts}
                    dataKey="sold"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 60 : 100}
                    label={isMobile ? false : true}
                    fill="#8884d8"
                >
                    {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(val) => `${val} sold`} />
                </PieChart>
            </ResponsiveContainer>
            </div>
      </div>
    </div>
  );
}