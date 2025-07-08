'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';

type ProductType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  tags: string[];
  category?: {
    id: string;
    name: string;
  };
};

export default function SellerProductsPage() {
  const { user } = useSessionStore();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    price: string;
    stock: string;
    tags: string;
    category: string;
  }>({
    name: '',
    description: '',
    price: '',
    stock: '',
    tags: '',
    category: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return alert('Not logged in');

    if (!form.name || !form.price || !form.stock) {
      alert('Please fill in all required fields (name, price, stock)');
      return;
    }

    const parsedPrice = parseFloat(form.price);
    const parsedStock = parseInt(form.stock);

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      alert('Invalid price or stock value');
      return;
    }

    try {
      const res = await fetch('/api/seller/newproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parsedPrice,
          stock: parsedStock,
          sellerId: user.id,
          categoryId: form.category || undefined,
          tags: form.tags
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => [data.product, ...prev]);
        setForm({
          name: '',
          description: '',
          price: '',
          stock: '',
          tags: '',
          category: '',
        });
        setShowForm(false);
      } else {
        const msg = await res.text();
        alert(`Error: ${msg}`);
      }
    } catch (err) {
      console.error('Error submitting product:', err);
      alert('Something went wrong. Please try again.');
    }
  };


  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      const res = await fetch(`/api/seller/products?sellerId=${user.id}`);
      const data = await res.json();
      setProducts(data.products || []);
    };

    const fetchCategories = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    };

    fetchProducts();
    fetchCategories();
  }, [user]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">Your Products</h1>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="stock"
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="tags"
            placeholder="Tags (comma-separated: shoes, nike, air)"
            value={form.tags}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setForm({
                  name: '',
                  description: '',
                  price: '',
                  stock: '',
                  tags: '',
                  category: '',
                });
                setShowForm(false);
              }}
              className="px-4 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Product
            </button>
          </div>
        </div>
      )}

      <table className="w-full text-left border border-gray-300 bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Tags</th>
            <th className="p-2">Category</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-4">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{product.name}</td>
                <td className="p-2">₹{product.price}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2 text-sm">{product.tags?.join(', ') || '-'}</td>
                <td className="p-2 text-sm">{product.category?.name || '-'}</td>
                <td className="p-2 text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
