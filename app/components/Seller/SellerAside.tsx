import { Text } from 'lucide-react';
import { Home, Package, BarChart3, ReceiptText } from 'lucide-react';
import Link from 'next/link';

const SellerAside = () => {
  return (
    <aside className="bg-black w-20 min-h-screen py-6 flex flex-col items-center border-r border-gray-800 text-white">
        <Link href="/seller" className="hover:text-purple-400">
          <Home className="w-6 h-6 my-6" />
        </Link>
        <Link href="/seller/products" className="hover:text-purple-400">
          <Package className="w-6 h-6 my-6" />
        </Link>
        <Link href="/seller/analytics" className="hover:text-purple-400">
          <BarChart3 className="w-6 h-6 my-6" />
        </Link>
        <Link href="/seller/orders" className="hover:text-purple-400">
          <ReceiptText className="w-6 h-6 my-6" />
        </Link>
    </aside>
  );
};

export default SellerAside;
