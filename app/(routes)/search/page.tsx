'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6 md:p-12">
      <h2 className="text-2xl font-bold mb-6">Results for "{query}"</h2>
      
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
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-500 border rounded-xl p-4 shadow">
      <div className="h-40 bg-gray-100 dark:bg-slate-800 rounded mb-4 flex items-center justify-center">
        No Image
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

      <button
        onClick={handleAddToCart}
        disabled={loading || added}
        className={`mt-4 w-full py-2 text-sm rounded-md transition ${
          added
            ? 'bg-green-500 text-white cursor-default'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {added ? 'Added!' : loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
