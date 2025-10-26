import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Footer from './components/Footer.jsx';

const initialProducts = [
  {
    id: 'P1001',
    name: "Men's Premium Cotton Tee",
    category: "Men's Fashion",
    price: 1299,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1200&auto=format&fit=crop',
    ],
    discount: 10,
    status: 'Active',
    label: 'Best Deal',
  },
  {
    id: 'P1002',
    name: 'Gold Accent Analog Watch',
    category: 'Accessories',
    price: 4999,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
    ],
    discount: 20,
    status: 'Active',
    label: 'New Arrival',
  },
  {
    id: 'P1003',
    name: "Women's Silk Scarf",
    category: "Women's Fashion",
    price: 1499,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1520975922284-7b12e08f7f46?q=80&w=1200&auto=format&fit=crop',
    ],
    discount: 0,
    status: 'Active',
    label: 'New Arrival',
  },
  {
    id: 'P1004',
    name: 'Smart Wireless Earbuds',
    category: 'Electronics',
    price: 5999,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1200&auto=format&fit=crop',
    ],
    discount: 15,
    status: 'Active',
    label: 'Best Deal',
  },
  {
    id: 'P1005',
    name: 'Minimal Ceramic Vase',
    category: 'Home Lifestyle',
    price: 1799,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1503088414719-7f87fefc2f63?q=80&w=1200&auto=format&fit=crop',
    ],
    discount: 5,
    status: 'Active',
    label: 'New Arrival',
  },
  {
    id: 'P1006',
    name: 'Kids Cotton Hoodie',
    category: 'Kids',
    price: 999,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1520975842061-190a2fe0baae?q=80&w=1200&auto=format&fit=crop',
    ],
    discount: 10,
    status: 'Active',
  },
];

const defaultCategories = [
  "Men's Fashion",
  "Women's Fashion",
  'Electronics',
  'Accessories',
  'Home Lifestyle',
  'Kids',
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState('shop'); // 'shop' | 'admin'

  // Simple client-side auth: name + role. Admin: Dhruv, Manager: Partner
  const [user, setUser] = useState({ loggedIn: false, name: '', role: 'guest' }); // roles: guest | manager | admin

  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState([
    { id: 'O-10001', items: [{ id: 'P1002', name: 'Gold Accent Analog Watch', qty: 1, price: 4999 }], total: 4999, status: 'Pending', customer: 'alice@example.com' },
    { id: 'O-10002', items: [{ id: 'P1006', name: 'Kids Cotton Hoodie', qty: 2, price: 999 }], total: 1998, status: 'Shipped', customer: 'bob@example.com' },
  ]);
  const [users, setUsers] = useState([
    { id: 'U-1', name: 'Dhruv', role: 'admin', email: 'admin@atoz.com' },
    { id: 'U-2', name: 'Partner', role: 'manager', email: 'manager@atoz.com' },
  ]);
  const [banners, setBanners] = useState([
    { id: 'B-1', title: 'Festive Sale', active: true },
    { id: 'B-2', title: 'New Arrivals Weekly', active: true },
  ]);
  const [categories, setCategories] = useState(defaultCategories);

  const categoriesWithAll = useMemo(() => ['All', ...categories], [categories]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setToast({ type: 'success', message: `${product.name} added to cart` });
    setTimeout(() => setToast(null), 2000);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, qty, stock) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, stock)) } : i))));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty * (1 - (i.discount || 0) / 100), 0);

  const onLogin = async ({ name, email, role }) => {
    // Simple demo gating based on name: Dhruv->admin, Partner->manager
    let resolvedRole = 'guest';
    if (role === 'admin' && name.trim().toLowerCase() === 'dhruv') resolvedRole = 'admin';
    if (role === 'manager' && name.trim().toLowerCase() === 'partner') resolvedRole = 'manager';
    if (resolvedRole === 'guest') {
      setToast({ type: 'error', message: 'Invalid credentials for selected role' });
      setTimeout(() => setToast(null), 2000);
      return false;
    }
    setUser({ loggedIn: true, name: name.trim(), role: resolvedRole, email });
    setToast({ type: 'success', message: `Welcome ${name}` });
    setTimeout(() => setToast(null), 1600);
    return true;
  };

  const onLogout = () => {
    setUser({ loggedIn: false, name: '', role: 'guest' });
    setActiveView('shop');
  };

  // Product CRUD with validation
  const validateProduct = (p) => {
    if (!p.name || p.name.trim().length < 3) return 'Product name must be at least 3 characters';
    if (!categories.includes(p.category)) return 'Category is invalid';
    if (Number.isNaN(Number(p.price)) || Number(p.price) <= 0) return 'Price must be a positive number';
    if (!Number.isInteger(Number(p.stock)) || Number(p.stock) < 0) return 'Stock must be a non-negative integer';
    if (!Array.isArray(p.images) || p.images.length === 0) return 'At least one image URL is required';
    if (p.images.some((u) => typeof u !== 'string' || !u.startsWith('http'))) return 'Images must be valid URLs';
    if (p.discount && (Number(p.discount) < 0 || Number(p.discount) > 90)) return 'Discount must be between 0 and 90';
    if (!['Active', 'Draft'].includes(p.status)) return 'Status must be Active or Draft';
    return null;
  };

  const addProduct = (data) => {
    const err = validateProduct(data);
    if (err) return err;
    const id = `P${Date.now()}`;
    setProducts((prev) => [{ ...data, id }, ...prev]);
    return null;
  };

  const updateProduct = (id, data) => {
    const err = validateProduct(data);
    if (err) return err;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data, id } : p)));
    return null;
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Orders (admin-only) status update
  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // Users (admin-only) basic role update
  const updateUserRole = (id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  // Banners (admin-only)
  const toggleBanner = (id) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  };

  // Categories (admin-only)
  const addCategory = (name) => {
    const n = name.trim();
    if (!n) return 'Category name required';
    if (categories.includes(n)) return 'Category already exists';
    setCategories((prev) => [...prev, n]);
    return null;
  };
  const removeCategory = (name) => {
    setCategories((prev) => prev.filter((c) => c !== name));
    // Also re-map products in removed category to first category
    setProducts((prev) => prev.map((p) => (p.category === name ? { ...p, category: defaultCategories[0] } : p)));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-yellow-400 selection:text-black">
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        updateQty={updateQty}
        subtotal={subtotal}
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      {activeView === 'shop' && (
        <main>
          <Hero />
          <section id="shop" className="relative z-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Shop A to Z</h2>
                  <p className="text-neutral-400">Explore New Arrivals and Best Deals curated for you</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full sm:w-72 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full sm:w-56 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {categoriesWithAll.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <ProductGrid products={filtered} addToCart={addToCart} />
          </section>
        </main>
      )}

      {activeView === 'admin' && (
        <AdminPanel
          user={user}
          products={products}
          categories={categories}
          orders={orders}
          users={users}
          banners={banners}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          updateOrderStatus={updateOrderStatus}
          updateUserRole={updateUserRole}
          toggleBanner={toggleBanner}
          addCategory={addCategory}
          removeCategory={removeCategory}
          setToast={setToast}
        />
      )}

      <Footer />

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-sm shadow-lg ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-neutral-800'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
