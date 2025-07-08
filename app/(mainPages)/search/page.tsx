import { prisma } from '@/app/lib/prisma';

interface SearchPageProps {
  searchParams: { query?: string };
}

export default async function SearchResultPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query?.toLowerCase() || '';

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
        {
          category: {
            name: { contains: query, mode: 'insensitive' },
          },
        },
      ],
    },
    include: { category: true },
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Results for “{query}”</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.category?.name || 'Uncategorized'}</p>
              <p className="text-sm">₹{p.price.toString()}</p>
              <p className="text-sm text-gray-600">{p.tags.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
