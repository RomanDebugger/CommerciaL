'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CartItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string | null;
  };
  quantity: number;
};

export default function CartPage() {
  const { user } = useSessionStore();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/cart', { credentials: 'include' });
        const data = await res.json();
        setCartItems(Array.isArray(data.cart) ? data.cart : []);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user, router]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
  if (newQuantity < 1) return;

  try {
    setIsUpdating(true);
    const res = await fetch('/api/cart/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cartItemId: itemId, quantity: newQuantity }),
    });

    if (res.ok) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  } catch (err) {
    console.error('Failed to update quantity:', err);
  } finally {
    setIsUpdating(false);
  }
};


  const removeItem = async (itemId: string) => {
    try {
      setIsUpdating(true);
      const res = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({  cartItemId: itemId }),
      });

      if (res.ok) {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
        <p className="text-gray-500 dark:text-white mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/home" className="inline-block px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
          {cartItems.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition dark:bg-black">
              <div className="flex-shrink-0">
                <img
                  src={item.product.imageUrl && item.product.imageUrl.trim() !== '' ? item.product.imageUrl : '/placeholder-product.png'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-lg dark:text-gray-50">{item.product.name}</h3>
                <p className="text-gray-950 dark:text-white">₹{Number(item.product.price).toFixed(2)}</p>

                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center border  dark:border-white rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={isUpdating || item.quantity <= 1}
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50  dark:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating}
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:text-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isUpdating}
                    className="bg-red-500 px-4 py-1 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50"
                  >
                    Remove From Cart
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 text-right font-medium dark:text-gray-300">
                ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4 dark:bg-gray-900 dark:text-white">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Total</span>
                <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full bg-gr1 text-white py-3 rounded-md hover:bg-gray-800 hover:text-gr1 transition disabled:opacity-50"
              disabled={isUpdating}
              onClick={()=>{router.push('/buyer/checkout')}}
            >
              Checkout
            </button>

            <div className="mt-4 text-center text-sm text-gray-800 dark:text-gray-400">
              or <Link href="/home" className="text-gr2 hover:underline">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
