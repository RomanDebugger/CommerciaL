'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';
import toast from 'react-hot-toast';

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
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof form>(form);
  const [categoryFilter,setCategoryFilter] = useState('');
  const [productSearch,setProductSearch] = useState('');
  const startEdit = (product: ProductType) => {
  setEditProductId(product.id);
  setEditForm({
    name: product.name,
    description: product.description || '',
    price: product.price.toString(),
    stock: product.stock.toString(),
    tags: product.tags.join(', '),
    category: product.category?.id || '',
  });
};

const handleEditChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const handleEditSubmit = async (productId: string) => {
  try {
    const res = await fetch('/api/seller/editproduct', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        productId,
        ...editForm,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
        categoryId : editForm.category,
        tags: editForm.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 0),
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updated.product : p))
      );
      setEditProductId(null);
    }
  } catch (_err) {
    toast.error('Error updating product');
  }
};
const handleDelete = async (productId: string) => {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const res = await fetch('/api/seller/deleteproduct', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  } catch (_err) {
    toast.error('Failed to delete product');
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return toast.error('Not logged in');

    if (!form.name || !form.price || !form.stock) {
      toast.error('Please fill in all required fields (name, price, stock)');
      return;
    }

    const parsedPrice = parseFloat(form.price);
    const parsedStock = parseInt(form.stock);

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      toast.error('Invalid price or stock value');
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
      }
    } catch (_err) {
      toast.error('Something went wrong. Please try again.');
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

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = categoryFilter
      ? product.category?.name === categoryFilter
      : true;

    return matchesName && matchesCategory;
  });


  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-6">
          <h1 className="text-xl font-bold dark:text-white">Your Products</h1>

          <input
            type="text"
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="rounded-xl bg-gray-900 text-white px-4 py-2 w-60 md:w-30 lg:w-60"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-gray-900 text-white px-4 py-2 w-60 md:w-30 lg:w-60"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>


      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
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
          </div>
        </div>
      )}
      <div className='overflow-x-auto w-full'>
      <table className="min-w-[900px] w-full text-left border border-gray-300 bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-600 text-white">
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
            filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                {editProductId === product.id ? (
                  <>
                    <td className="p-2">
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        name="stock"
                        value={editForm.stock}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        name="tags"
                        value={editForm.tags}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      >
                        <option value="">Select</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(product.id)}
                        className="bg-green-600 text-white rounded-lg p-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditProductId(null)}
                        className="bg-gray-500 text-white rounded-lg p-2"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">₹{product.price}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2 text-sm">{product.tags?.join(', ') || '-'}</td>
                    <td className="p-2 text-sm">{product.category?.name || '-'}</td>
                    <td className="p-2 text-sm flex items-center gap-2 text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                      <button
                        onClick={() => startEdit(product)}
                        className="ml-2 bg-blue-600 text-white p-2 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white p-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>

      </table>
      </div>
    </div>
  );
}
