'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-5 py-4 shadow-lg">
      <Search className="text-purple-400" />
      <input
        type="text"
        placeholder="Search for products, brands, or categories..."
        className="w-full bg-transparent outline-none text-white placeholder-gray-300 text-lg tracking-wide"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
    </div>
  );
}
