'use client';
import { useSessionStore } from '@/app/store/useSessionStore';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
interface Product {
  id: string;
  name: string;
  price: number;
  category: { name: string } | null;
  tags: string[];
}
export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/buyer/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setProducts(data);
      } catch (_err) {
        toast.error('Search failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6 md:p-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Results for &quot;{query}&quot;</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { user } = useSessionStore();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [isInCart,setIsInCart] = useState(false);
  const router = useRouter();
  const handleAddToCart = async () => {
    if(!user){
      router.push('/auth');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/buyer/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      setAdded(true);
      setIsInCart(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (_err) {
      toast.error('Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black dark:text-gray-300 rounded-xl p-4 shadow">
      <div className="relative aspect-square w-full bg-gray-100 dark:bg-slate-800 rounded-lg mb-4 overflow-hidden">
        <Image
          src="/placeholder-product.png" 
          alt={product.name}
          className="object-cover"
          width={300}
          height={300}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.png';
          }}
        />
      </div>
       
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.category?.name || 'Uncategorized'}</p>
      <p className="text-base font-bold">₹{product.price}</p>

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {product.tags.map((tag) => (
            <span key={tag} className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {isInCart || added ? (
        <button
          onClick={() => router.push('/buyer/cart')}
          className="mt-4 w-full py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition"
        >
          Go to Cart
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="mt-4 w-full py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
}
