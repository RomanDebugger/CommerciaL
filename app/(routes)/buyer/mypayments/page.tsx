'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard } from 'lucide-react';
import Image from 'next/image';

type PendingPayment = {
  id: string;
  amount: number;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string | null;
  }[];
};

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/order/pending', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setPayments(data);
        } else {
          console.error('Failed to fetch payments:', data.error);
        }
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Pending Payments</h1>

        {payments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-50">No pending payments. You're all caught up 🎉</p>
        ) : (
          <div className="space-y-6">
            {payments.map(payment => (
              <div key={payment.id} className="bg-white dark:bg-black p-6 rounded-lg shadow border">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium dark:text-white text-gray-800">Order #{payment.id.slice(0, 8)}...</h2>
                  <span className="text-sm text-gray-500">
                    {payment.createdAt}
                  </span>
                </div>

                <div className="space-y-2">
                  {payment.items.map(item => (
                    <div key={item.id} className="flex items-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={item.imageUrl || '/placeholder-product.png'}
                          className="w-full h-full object-cover"
                          width = {100}
                          alt={item.name}
                          height = {100}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-bold text-xl text-gray-900 dark:text-gray-200">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} | ₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">Total: <span className="font-medium">₹{Number(payment.amount).toFixed(2)}</span></p>
                  <button
                    onClick={() => router.push(`/buyer/payment?orderId=${payment.id}&amount=${payment.amount}`)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
