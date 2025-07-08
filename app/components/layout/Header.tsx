'use client';
import Link from 'next/link';
import HeaderUser from './HeaderUser';
import SearchBar from '../SearchBar';
import { usePathname } from 'next/navigation';
export default function Header() {
  const pathname = usePathname();
  const nosearchheader = pathname.startsWith('/home') || pathname.startsWith('/auth');
  return (
    <header className="w-full px-6 py-4 shadow-sm border-b bg-black flex items-center sticky justify-between top-0 z-50">
      <div className="text-2xl font-bold bg-gradient-to-r from-gr1 to-gr2 bg-clip-text text-transparent">
        <Link href="/home">CommerciaL</Link>
      </div>
      <div className={`${nosearchheader ? 'hidden' : ''} px-6 md:px-16 lg:w-180 md:w-100 w-50`}>
      <SearchBar/>
      </div>
      <HeaderUser/>
    </header>
  );
}
