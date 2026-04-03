'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Package, ShoppingBag, Plus, Trash2, Edit2, X, Check, LogOut, Upload, Star
} from 'lucide-react';
import { Product, Order } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const CATEGORIES = ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Anklets', 'Sets'];

const emptyForm = {
  name: '', description: '', price: '', category: 'Necklaces', stock: '', featured: false,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) router.push('/admin');
  }, [router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ]);
      setProducts(pRes.data);
      setOrders(oRes.data);
    } catch {
      toast.error('Failed to load data. Please re-login.');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [checkAuth, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFiles([]);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      featured: product.featured,
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      formData.append('featured', String(form.featured));
      imageFiles.forEach((f) => formData.append('images', f));

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product added!');
      }

      setShowForm(false);
      fetchData();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-terracotta-50">
      {/* Admin Header */}
      <div className="bg-terracotta-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌸</span>
          <div>
            <div className="font-serif font-bold">Sparkle Sisterz</div>
            <div className="text-xs text-terracotta-300">Admin Dashboard</div>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-terracotta-300 hover:text-white text-sm transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length, icon: Package, color: 'bg-terracotta-500' },
            { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-500' },
            { label: 'Pending Orders', value: orders.filter((o) => o.status === 'pending').length, icon: ShoppingBag, color: 'bg-yellow-500' },
            { label: 'Featured Items', value: products.filter((p) => p.featured).length, icon: Star, color: 'bg-gold-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-terracotta-800">{stat.value}</div>
                <div className="text-xs text-terracotta-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'products', label: 'Products', icon: Package },
            { key: 'orders', label: 'Orders', icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'products' | 'orders')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-white text-terracotta-600 hover:bg-terracotta-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif font-semibold text-terracotta-800 text-xl">Products</h2>
              <button onClick={openAddForm} className="btn-primary text-sm">
                <Plus size={16} /> Add Product
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-terracotta-400">Loading...</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-terracotta-50 text-terracotta-600">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Product</th>
                        <th className="text-left px-4 py-3 font-medium">Category</th>
                        <th className="text-left px-4 py-3 font-medium">Price</th>
                        <th className="text-left px-4 py-3 font-medium">Stock</th>
                        <th className="text-left px-4 py-3 font-medium">Featured</th>
                        <th className="text-right px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-terracotta-50">
                      {products.map((product) => {
                        const imageUrl = product.images?.[0]
                          ? product.images[0].startsWith('http')
                            ? product.images[0]
                            : `${API_BASE}${product.images[0]}`
                          : null;

                        return (
                          <tr key={product.id} className="hover:bg-terracotta-50/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta-200 to-terracotta-400 flex-shrink-0 overflow-hidden">
                                  {imageUrl ? (
                                    <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                                  ) : (
                                    <span className="w-full h-full flex items-center justify-center text-sm">🌸</span>
                                  )}
                                </div>
                                <span className="font-medium text-terracotta-800 line-clamp-1">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-terracotta-500">{product.category}</td>
                            <td className="px-4 py-3 font-medium text-terracotta-700">₹{product.price.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {product.featured ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <X size={16} className="text-terracotta-300" />
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditForm(product)}
                                  className="p-1.5 text-terracotta-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-serif font-semibold text-terracotta-800 text-xl mb-4">Orders</h2>
            {loading ? (
              <div className="text-center py-10 text-terracotta-400">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-terracotta-400">
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="font-bold text-terracotta-800">{order.id}</div>
                        <div className="text-sm text-terracotta-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border border-terracotta-200 rounded-lg px-2 py-1 text-terracotta-600"
                        >
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-terracotta-400 mb-1">Customer</div>
                        <div className="font-medium text-terracotta-800">{order.customer.name}</div>
                        <div className="text-terracotta-500">{order.customer.phone}</div>
                        <div className="text-terracotta-500 text-xs mt-1">
                          {order.customer.address}, {order.customer.city} {order.customer.pincode}
                        </div>
                      </div>
                      <div>
                        <div className="text-terracotta-400 mb-1">Items</div>
                        {order.items.map((item) => (
                          <div key={item.product.id} className="text-terracotta-700">
                            {item.product.name} × {item.quantity}
                          </div>
                        ))}
                        <div className="font-bold text-terracotta-700 mt-1">
                          Total: ₹{order.total.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-terracotta-400 ml-2">
                            ({order.paymentMethod === 'upi' ? 'UPI' : 'COD'})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-terracotta-100">
              <h3 className="font-serif font-semibold text-terracotta-800 text-lg">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-terracotta-400 hover:text-terracotta-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-terracotta-700 mb-1">Product Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="e.g. Floral Terracotta Necklace"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-terracotta-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe the product..."
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-terracotta-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    required
                    min="0"
                    placeholder="499"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-terracotta-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                    required
                    min="0"
                    placeholder="10"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-terracotta-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="input-field"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 accent-terracotta-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-terracotta-700">
                  Featured on homepage
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-terracotta-700 mb-1">
                  Product Images (max 5)
                </label>
                <label className="flex items-center gap-3 border-2 border-dashed border-terracotta-200 rounded-xl p-4 cursor-pointer hover:border-terracotta-400 transition-colors">
                  <Upload size={20} className="text-terracotta-400" />
                  <span className="text-sm text-terracotta-400">
                    {imageFiles.length > 0
                      ? `${imageFiles.length} file(s) selected`
                      : 'Click to upload images'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
