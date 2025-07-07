import Link from 'next/link';
import HeaderUser from './HeaderUser';

export default function Header() {
  return (
    <header className="w-full px-6 py-4 shadow-sm border-b bg-black flex items-center sticky justify-between top-0 z-50">
      <div className="text-2xl font-bold bg-gradient-to-r from-gr1 to-gr2 bg-clip-text text-transparent">
        <Link href="/home">CommerciaL</Link>
      </div>

        <HeaderUser/>
    </header>
  );
}
