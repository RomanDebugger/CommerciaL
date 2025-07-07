'use client';

import { useState } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';

export default function AddProductForm() {
  const { user } = useSessionStore();
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

    const res = await fetch('/api/seller/product', {
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
      alert('Product added!');
      console.log(data.product);
    } else {
      const msg = await res.text();
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>

      <input name="name" placeholder="Product Name" onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
      <input name="price" placeholder="Price" type="number" onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
      <input name="stock" placeholder="Stock" type="number" onChange={handleChange} className="w-full mb-4 p-2 border rounded" />

      <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        Add Product
      </button>
    </div>
  );
}
