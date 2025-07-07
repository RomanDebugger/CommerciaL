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
};



export default function SellerProductsPage() {
  const { user } = useSessionStore();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
   
    const handleSubmit = async () => {
    if (!user) return alert('Not logged in');

    const res = await fetch('/api/seller/newproduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        sellerId: user.id,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setProducts((prev) => [data.product, ...prev]); 
      setForm({ name: '', description: '', price: '', stock: '' }); 
      setShowForm(false);
    } else {
      const msg = await res.text();
      alert(`Error: ${msg}`);
    }
  };


    useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      const res = await fetch(`/api/seller/products?sellerId=${user.id}`);
      const data = await res.json();
      setProducts(data.products || []);
    };
    fetchProducts();
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
      className="w-full mb-4 p-2 border rounded"
    />

    <div className="flex justify-end gap-2">
      <button
        onClick={() => {
        setForm({ name: '', description: '', price: '', stock: '' });
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
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan={4} className="text-center text-gray-500 py-4">No products found.</td></tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{product.name}</td>
                <td className="p-2">₹{product.price}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2 text-sm text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

