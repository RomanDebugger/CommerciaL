'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

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

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/buyer/cart', { credentials: 'include' });
        const data = await res.json();
        setCartItems(Array.isArray(data.cart) ? data.cart : []);
      } catch (_err) {
        toast.error('Failed to fetch cart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      const res = await fetch('/api/buyer/order/checkout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/buyer/payment?orderId=${data.orderId}&amount=${totalAmount}`);
      } else {
        toast.error(data.error || 'Checkout failed');
      }
    } catch (_err) {
      toast.error('Something went wrong. Try again later.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-xl font-medium">Loading your cart...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">Review your order before payment</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Order Summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            
            <div className="mt-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center">
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        src={item.product.imageUrl || '/placeholder-product.png'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between text-base font-medium text-gray-900">
                        <h3>{item.product.name}</h3>
                        <p>₹{(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                        <p>Qty {item.quantity}</p>
                        <p>₹{item.product.price} each</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Total */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">Shipping and taxes calculated at payment</p>
            <div className="mt-6">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cartItems.length === 0}
                className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isPlacingOrder ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Proceed to Payment'}
              </button>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{' '}
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}