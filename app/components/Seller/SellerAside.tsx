'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Package, BarChart3, ReceiptText } from 'lucide-react';

const navItems = [
  { href: '/seller', icon: Home, label: 'Home' },
  { href: '/seller/products', icon: Package, label: 'Products' },
  { href: '/seller/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/seller/orders', icon: ReceiptText, label: 'Orders' },
];

export default function SellerAside() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 w-full sm:static sm:w-20 md:w-24 bg-black text-white border-t sm:border-t-0 sm:border-r border-gray-800 z-50 md:z-0 flex sm:flex-col items-center justify-around sm:justify-start py-2 sm:py-6">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`group flex flex-col items-center justify-center gap-1 px-2 py-2 text-sm transition-colors ${
              isActive ? 'text-purple-400' : 'text-white hover:text-purple-400'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="hidden md:block text-xs">{label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
