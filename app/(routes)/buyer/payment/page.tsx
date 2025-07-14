'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Check, 
  Loader2, 
  CreditCard, 
  Smartphone, 
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!orderId || !amount) {
      router.push('/buyer/checkout');
    }
  }, [orderId, amount, router]);

    const handlePayment = async () => {
    if (!paymentMethod) return;
    setIsProcessing(true);

    try {
        const res = await fetch('/api/order/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
            router.push('/buyer/orders');
        }, 2000);
        } else {
        toast.error(data.error || 'Payment failed. Try again.');
        }
    } catch (_err) {
        toast.error('Payment error. Please try again.');
    } finally {
        setIsProcessing(false);
    }
    };


  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-1">Your order #{orderId} has been confirmed.</p>
          <p className="text-gray-500 text-sm mb-6">You will be redirected shortly...</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-indigo-600 h-1.5 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="mt-2 text-gray-600">Order #{orderId}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Total Amount</h2>
              <p className="text-2xl font-bold">₹{Number(amount).toFixed(2)}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
            
            <div className="space-y-4">
              <div 
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'card' 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                    paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'card' && (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Credit/Debit Card</h4>
                      <CreditCard className="h-5 w-5 text-indigo-500" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Visa, Mastercard, etc.</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'upi' 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                    paymentMethod === 'upi' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'upi' && (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">UPI Payment</h4>
                      <Smartphone className="h-5 w-5 text-indigo-500" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Google Pay, PhonePe, etc.</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'wallet' 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                    paymentMethod === 'wallet' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'wallet' && (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Digital Wallet</h4>
                      <Wallet className="h-5 w-5 text-indigo-500" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Paytm, Mobikwik, etc.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !paymentMethod}
              className={`w-full mt-6 py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
                !paymentMethod 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing Payment...
                </span>
              ) : (
                `Pay ₹${Number(amount).toFixed(2)}`
              )}
            </button>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-full">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">Encrypted with 256-bit SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}