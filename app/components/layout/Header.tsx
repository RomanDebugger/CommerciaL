'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full px-6 py-4 shadow-sm border-b flex items-center justify-between bg-white">
      <div className="text-2xl font-bold text-blue-600">
        <Link href="/">CommerciaL</Link>
      </div>
      <div className="space-x-4">
        <Link href="/auth" className="text-sm text-gray-700 hover:text-black">Create Account</Link>
      </div>
    </header>
  );
}
