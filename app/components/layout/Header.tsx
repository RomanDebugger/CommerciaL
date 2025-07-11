'use client';

import Link from 'next/link';
import HeaderUser from './HeaderUser';
import SearchBar from '../SearchBar';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const noSearch = pathname.startsWith('/auth') || pathname.startsWith('/seller');

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Prevent scrolling when mobile search is open
  useEffect(() => {
    if (mobileSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSearchOpen]);

  const handleMobileSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
    setMobileSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      <header className="w-full px-4 sm:px-6 py-3 sm:py-4 shadow-sm border-b bg-black flex items-center justify-between sticky top-0 z-50 gap-4">
        <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gr1 to-gr2 bg-clip-text text-transparent whitespace-nowrap">
          <Link href="/home" className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
            CommerciaL
          </Link>
        </div>

        {!noSearch && (
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <SearchBar />
          </div>
        )}

        {!noSearch && (
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-xl text-sm transition-colors"
            aria-label="Open search"
          >
            <Search className="w-4 h-4 text-white" />
            <span className="sr-only">Search</span>
          </button>
        )}

        <div className="shrink-0">
          <HeaderUser />
        </div>
      </header>

      {/* Mobile search overlay */}
      <div
        className={`fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm transition-all duration-200 ${
          mobileSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSearchOpen(false)}
        aria-hidden={!mobileSearchOpen}
      />

      {/* Mobile search bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[9999] bg-black px-4 py-3 shadow-md flex items-center gap-3 transition-all duration-200 ${
          mobileSearchOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-hidden={!mobileSearchOpen}
      >
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 text-purple-400 w-5 h-5" />
          <input
            type="text"
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMobileSearch()}
            autoFocus={mobileSearchOpen}
            aria-label="Search input"
          />
        </div>
        <button
          onClick={() => setMobileSearchOpen(false)}
          className="text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}