'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';
import { Package } from 'lucide-react';

type SubOrder = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  order: {
    buyerProfile: {
      user: {
        email: string;
      };
    };
  };
};

export default function SellerOrdersPage() {
  const { user } = useSessionStore();
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/seller/orders');
        const data = await res.json();
        setOrders(data.subOrders || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const getStatusStyle = (status: string) => {
    const map: Record<string, string> = {
      PROCESSING: 'bg-amber-50 text-amber-800 border-amber-200',
      SHIPPED: 'bg-blue-50 text-blue-800 border-blue-200',
      IN_TRANSIT: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      DELIVERED: 'bg-green-50 text-green-800 border-green-200',
      CANCELLED: 'bg-red-50 text-red-800 border-red-200',
    };
    return map[status] || 'bg-gray-50 text-gray-800 border-gray-200';
  };
    const activeOrders = orders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status));
    const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');
    const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED');

    if (loading) return (
        <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading orders...</p>
        </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Order Management</h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No active orders</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">When you receive orders, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Order Summary
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <p className="flex gap-2">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Order ID:</span>
                      <span className="font-mono">{order.id}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Buyer:</span>
                      <span>{order.order.buyerProfile.user.email}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Date:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </p>
                  </div>
                    <div className="flex items-start sm:items-center">
                    <select
                        className={`px-3 py-1 text-sm font-medium rounded-full border cursor-pointer focus:outline-none ${getStatusStyle(order.status)}`}
                        value={order.status}
                        onChange={async (e) => {
                            const newStatus = e.target.value;

                            if (
                                ['CANCELLED', 'DELIVERED'].includes(newStatus) &&
                                !window.confirm(`Are you sure you want to mark this order as ${newStatus}? This action cannot be undone.`)
                            ) {
                                return;
                            }

                            try {
                                const res = await fetch(`/api/seller/orders/${order.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ newStatus }),
                                });

                                if (!res.ok) throw new Error('Failed to update');

                                const data = await res.json();
                                setOrders((prev) =>
                                prev.map((o) => (o.id === order.id ? { ...o, status: data.subOrder.status } : o))
                                );
                            } catch (err) {
                                console.error('Failed to update order status:', err);
                                alert('Status update failed.');
                            }
                            }}
                        disabled={['DELIVERED', 'CANCELLED'].includes(order.status)}
                    >
                        {['PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <option key={status} value={status}>
                            {status.replace('_', ' ')}
                        </option>
                        ))}
                    </select>
                    </div>

                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3 text-sm">
                
                <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-500 dark:text-gray-400">
                    <div className="col-span-7">Product Name</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-3 text-right">Price</div>
                </div>
                
                {order.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 items-center">
                    <div className="col-span-7 text-gray-800 dark:text-gray-200">{item.name}</div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-3 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-base font-semibold">
                    <span className="text-gray-500 dark:text-gray-400 mr-2">Total:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">₹{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div>
            
        </div>
      </div>
      {/* Delivered Section */}
{deliveredOrders.length > 0 && (
  <section className="mt-12">
    <h2 className="text-lg font-semibold mb-4">Delivered Orders</h2>
    <div className="flex gap-4 overflow-x-auto pb-4">
      {deliveredOrders.map((order) => (
        <div key={order.id} className="min-w-[300px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
          <p className="text-sm">Buyer: {order.order.buyerProfile.user.email}</p>
          <p className="text-sm text-green-600 font-semibold">Status: Delivered</p>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
      ))}
    </div>
  </section>
)}

{/* Cancelled Section */}
{cancelledOrders.length > 0 && (
  <section className="mt-12">
    <h2 className="text-lg font-semibold mb-4">Cancelled Orders</h2>
    <div className="flex gap-4 overflow-x-auto pb-4">
      {cancelledOrders.map((order) => (
        <div key={order.id} className="min-w-[300px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-red-400/20">
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
          <p className="text-sm">Buyer: {order.order.buyerProfile.user.email}</p>
          <p className="text-sm text-red-600 font-semibold">Status: Cancelled</p>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
      ))}
    </div>
  </section>
)}

    </div>
  );
}