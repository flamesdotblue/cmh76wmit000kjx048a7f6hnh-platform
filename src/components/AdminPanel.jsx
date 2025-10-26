import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';

export default function AdminPanel({
  user,
  products,
  categories,
  orders,
  users,
  banners,
  addProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  updateUserRole,
  toggleBanner,
  addCategory,
  removeCategory,
  setToast,
}) {
  const [tab, setTab] = useState('products');
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  if (!user?.loggedIn || !(isAdmin || isManager)) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-8 text-center">
          <h2 className="text-2xl font-semibold">Restricted Area</h2>
          <p className="mt-2 text-neutral-400">You must be logged in as Admin (Dhruv) or Manager (Partner) to access the Admin Panel.</p>
        </div>
      </section>
    );
  }

  const visibleTabs = useMemo(() => {
    const t = [{ key: 'products', label: 'Products' }];
    if (isAdmin) {
      t.push(
        { key: 'orders', label: 'Orders' },
        { key: 'users', label: 'Users' },
        { key: 'banners', label: 'Banners' },
        { key: 'categories', label: 'Categories' },
      );
    }
    return t;
  }, [isAdmin]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Admin Panel</h2>
          <p className="text-neutral-400 text-sm">Role-based access • {isAdmin ? 'Admin' : 'Manager'}</p>
        </div>
        <div className="flex gap-2">
          {visibleTabs.map((t) => (
            <button key={t.key} onClick={()=>setTab(t.key)} className={`rounded-md border px-3 py-2 text-sm ${tab===t.key?'border-yellow-500 text-yellow-400 bg-neutral-900':'border-neutral-800 bg-neutral-900 hover:border-yellow-500'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {tab === 'products' && (
        <ProductsTab
          products={products}
          categories={categories}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          setToast={setToast}
          canDelete={isAdmin || isManager}
        />
      )}

      {tab === 'orders' && isAdmin && (
        <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} />
      )}

      {tab === 'users' && isAdmin && (
        <UsersTab users={users} updateUserRole={updateUserRole} />
      )}

      {tab === 'banners' && isAdmin && (
        <BannersTab banners={banners} toggleBanner={toggleBanner} />
      )}

      {tab === 'categories' && isAdmin && (
        <CategoriesTab categories={categories} addCategory={addCategory} removeCategory={removeCategory} />
      )}
    </section>
  );
}

function ProductsTab({ products, categories, addProduct, updateProduct, deleteProduct, setToast, canDelete }) {
  const emptyForm = { name: '', category: categories[0] || '', price: '', stock: '', images: [''], discount: 0, status: 'Active' };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null); // id | null

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.map((s) => s.trim()).filter(Boolean),
      discount: Number(form.discount || 0),
    };
    if (editing) {
      const err = updateProduct(editing, payload);
      if (err) { setToast({ type: 'error', message: err }); setTimeout(()=>setToast(null), 2000); return; }
      setToast({ type: 'success', message: 'Product updated' });
    } else {
      const err = addProduct(payload);
      if (err) { setToast({ type: 'error', message: err }); setTimeout(()=>setToast(null), 2000); return; }
      setToast({ type: 'success', message: 'Product added' });
    }
    setTimeout(()=>setToast(null), 1600);
    setForm(emptyForm);
    setEditing(null);
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, images: p.images, discount: p.discount || 0, status: p.status || 'Active' });
  };

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-neutral-900 bg-neutral-950 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Products</h3>
          <span className="text-xs text-neutral-500">{products.length} items</span>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-[64px_1fr_auto] gap-3 border border-neutral-900 rounded-lg p-3 items-center">
              <img src={p.images[0]} alt={p.name} className="h-16 w-16 rounded object-cover" />
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.category} • ₹{p.price.toLocaleString('en-IN')} • Stock {p.stock}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>startEdit(p)} className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs hover:border-yellow-500 inline-flex items-center gap-1"><Pencil size={14}/>Edit</button>
                {canDelete && (
                  <button onClick={()=>deleteProduct(p.id)} className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs hover:border-red-600 inline-flex items-center gap-1 text-red-400"><Trash2 size={14}/>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">{editing ? 'Edit Product' : 'Add Product'} <Plus size={16} className="text-yellow-400"/></h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Category</label>
            <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm">
              {categories.map((c)=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Price (₹)</label>
              <input type="number" min="1" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Discount (%)</label>
            <input type="number" min="0" max="90" value={form.discount} onChange={(e)=>setForm({...form,discount:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Status</label>
            <select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm">
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Image URLs</label>
            <div className="space-y-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={img} onChange={(e)=>{
                    const next = [...form.images];
                    next[idx] = e.target.value;
                    setForm({...form,images:next});
                  }} className="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" placeholder="https://..." />
                  <button type="button" onClick={()=>{
                    const next = form.images.filter((_,i)=>i!==idx);
                    setForm({...form,images: next.length? next : ['']});
                  }} className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={()=>setForm({...form,images:[...form.images,'']})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-yellow-500">Add another image</button>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-md bg-yellow-500 text-black font-semibold px-3 py-2 hover:bg-yellow-400 inline-flex items-center justify-center gap-2"><Check size={16}/>{editing?'Update':'Create'}</button>
            {editing && <button type="button" onClick={()=>{setEditing(null);setForm(emptyForm);}} className="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm inline-flex items-center justify-center gap-2 hover:border-neutral-700"><X size={16}/>Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

function OrdersTab({ orders, updateOrderStatus }) {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  return (
    <div className="mt-6 grid grid-cols-1 gap-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Order {o.id}</h4>
              <p className="text-xs text-neutral-400">{o.items.length} item(s) • ₹{o.total.toLocaleString('en-IN')} • {o.customer}</p>
            </div>
            <select value={o.status} onChange={(e)=>updateOrderStatus(o.id, e.target.value)} className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm">
              {statuses.map((s)=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <ul className="mt-3 text-sm text-neutral-300 list-disc pl-5">
            {o.items.map((i)=> <li key={i.id}>{i.name} × {i.qty} — ₹{i.price.toLocaleString('en-IN')}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function UsersTab({ users, updateUserRole }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4">
      {users.map((u) => (
        <div key={u.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{u.name}</h4>
            <p className="text-xs text-neutral-400">{u.email}</p>
          </div>
          <select value={u.role} onChange={(e)=>updateUserRole(u.id, e.target.value)} className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm">
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="customer">customer</option>
          </select>
        </div>
      ))}
    </div>
  );
}

function BannersTab({ banners, toggleBanner }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4">
      {banners.map((b) => (
        <div key={b.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{b.title}</h4>
            <p className="text-xs text-neutral-400">ID: {b.id}</p>
          </div>
          <button onClick={()=>toggleBanner(b.id)} className={`rounded-md px-3 py-2 text-sm border ${b.active?'border-emerald-600 text-emerald-400':'border-neutral-700 text-neutral-400'} bg-neutral-900 hover:border-yellow-500`}>
            {b.active ? 'Active' : 'Inactive'}
          </button>
        </div>
      ))}
    </div>
  );
}

function CategoriesTab({ categories, addCategory, removeCategory }) {
  const [value, setValue] = useState('');
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
        <h3 className="font-semibold mb-3">Existing Categories</h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c} className="flex items-center justify-between rounded-md border border-neutral-900 bg-neutral-950 px-3 py-2">
              <span className="text-sm">{c}</span>
              <button onClick={()=>removeCategory(c)} className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs hover:border-red-600 inline-flex items-center gap-1 text-red-400"><Trash2 size={14}/>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
        <h3 className="font-semibold mb-3">Add Category</h3>
        <div className="flex gap-2">
          <input value={value} onChange={(e)=>setValue(e.target.value)} className="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" placeholder="e.g., Beauty" />
          <button onClick={()=>{ const err = addCategory(value); if(!err){ setValue(''); } }} className="rounded-md bg-yellow-500 text-black font-semibold px-3 py-2 hover:bg-yellow-400">Add</button>
        </div>
      </div>
    </div>
  );
}
