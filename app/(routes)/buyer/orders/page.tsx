'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ORDER_STEPS = ['PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] as const;

type OrderStatus = typeof ORDER_STEPS[number];

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type SubOrder = {
  id: string;
  status: OrderStatus;
  items: Product[];
  total: number;
};

type Order = {
  id: string;
  status: OrderStatus;
  total: number;
  items: Product[];
  createdAt: string;
  subOrders: SubOrder[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/order/display');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 md:p-12">
      <h2 className="text-3xl font-bold mb-8">Your Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-6 bg-white dark:bg-black shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl dark:text-gray-200 font-semibold">Order #{order.id.slice(0, 8)}...</h3>
                  <p className="text-gray-500 text-sm">
                    Placed on {order.createdAt}
                  </p>
                  <p className="mt-2 text-lg font-bold dark:text-gray-400">₹{order.total}</p>
                </div>

                <button
                  onClick={() =>
                    setExpandedOrderId((prev) => (prev === order.id ? null : order.id))
                  }
                  className="text-purple-600 hover:underline"
                >
                  {expandedOrderId === order.id ? (
                    <div className="flex items-center gap-1">Hide Details <ChevronUp size={18} /></div>
                  ) : (
                    <div className="flex items-center gap-1">View Details <ChevronDown size={18} /></div>
                  )}
                </button>
              </div>

              <Timeline status={order.status} />

              {expandedOrderId === order.id && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-semibold mb-2">Products</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-100 dark:bg-slate-600 rounded-lg p-4"
                      >
                        <h5 className="font-semibold">{item.name}</h5>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                        <p className="text-sm">Price: ₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Timeline({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') {
    return (
      <div className="mt-4 flex items-center gap-2 text-red-600 font-medium text-sm">
        <div className="w-4 h-4 rounded-full border-2 bg-red-600 border-red-600" />
        <span>Order Cancelled</span>
      </div>
    );
  }

  const currentStep = ORDER_STEPS.indexOf(status);

  return (
    <div className="mt-4 flex items-center gap-4 overflow-x-auto">
      {ORDER_STEPS.slice(0, 4).map((step, i) => (
        <div key={step} className="flex items-center gap-2 shrink-0">
          <div
            className={`w-4 h-4 rounded-full border-2 transition ${
              i <= currentStep ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
            }`}
          />
          <span
            className={`text-xs transition ${
              i <= currentStep ? 'text-purple-600 font-medium' : 'text-gray-400'
            }`}
          >
            {step.replace('_', ' ')}
          </span>
          {i !== 3 && <div className="w-8 h-px bg-gray-300" />}
        </div>
      ))}
    </div>
  );
}


