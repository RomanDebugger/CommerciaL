import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full px-6 py-4 shadow-sm border-b bg-black flex items-center sticky justify-between top-0 z-50">
      <div className="text-2xl font-bold bg-gradient-to-r from-gr1 to-gr2 bg-clip-text text-transparent">
        <Link href="/home">CommerciaL</Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-tr from-gr1 via-gr2 to-gr3 px-1 py-1">
        <Link
          href="/auth"
          className="text-sm px-6 py-2 block bg-black text-white rounded-xl hover:opacity-90 hover:bg-gradient-to-r hover:from-gr3 hover:via-gr2 hover:to-gr1 hover:text-black focus:outline-none focus:ring-2 focus:ring-gr2 transition-all duration-300 ease-in-out"
        >
          Create Account
        </Link>
      </div>
    </header>
  );
}
