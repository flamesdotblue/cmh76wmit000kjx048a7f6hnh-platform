import { useState } from 'react';
import { ShoppingCart, X, Menu, User, Shield, LogOut, ShieldCheck } from 'lucide-react';

function LogoWordmark() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8 grid place-items-center rounded-md bg-gradient-to-br from-yellow-500 to-yellow-700 text-black font-black">
        <span className="text-base leading-none">A</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight">A to Z</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-400">Collection</span>
      </div>
    </div>
  );
}

function AuthDialog({ open, onClose, onLogin }) {
  const [step, setStep] = useState('form'); // form | otp
  const [form, setForm] = useState({ name: '', email: '', role: 'manager' });
  const [otp, setOtp] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    setStep('otp');
  };
  const submitOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length < 4) return;
    const ok = await onLogin(form);
    if (ok) onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md rounded-xl border border-neutral-800 bg-neutral-950 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck size={18} className="text-yellow-400"/> Secure Login</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-neutral-900"><X size={18} /></button>
        </div>
        {step === 'form' && (
          <form onSubmit={submitForm} className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Full Name</label>
                <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Dhruv or Partner" required />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Role</label>
                <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <option value="manager">Manager (Partner)</option>
                  <option value="admin">Admin (Dhruv)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full rounded-md bg-yellow-500 text-black font-semibold px-3 py-2 hover:bg-yellow-400">Continue</button>
            <p className="text-xs text-neutral-500">Tip: Use name Dhruv for Admin, Partner for Manager.</p>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={submitOtp} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Enter OTP</label>
              <input value={otp} onChange={(e)=>setOtp(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="1234" />
            </div>
            <button type="submit" className="w-full rounded-md bg-yellow-500 text-black font-semibold px-3 py-2 hover:bg-yellow-400">Verify & Login</button>
            <button type="button" onClick={()=>setStep('form')} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-yellow-500">Back</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Header({ cart, removeFromCart, updateQty, subtotal, activeView, setActiveView, user, onLogin, onLogout }) {
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const Brand = LogoWordmark;

  const canAccessAdmin = user.loggedIn && (user.role === 'admin' || user.role === 'manager');

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 bg-neutral-950 border-b border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => setOpen((o) => !o)} className="md:hidden p-2 rounded-md hover:bg-neutral-900" aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <a href="#top" className="flex items-center gap-3">
          <Brand />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={()=>setActiveView('shop')} className={`hover:text-yellow-400 transition ${activeView==='shop'?'text-yellow-400':''}`}>Shop</button>
          {canAccessAdmin && (
            <button onClick={()=>setActiveView('admin')} className={`hover:text-yellow-400 transition ${activeView==='admin'?'text-yellow-400':''}`}>Admin</button>
          )}
          <a href="#about" className="hover:text-yellow-400 transition">About</a>
          <a href="#contact" className="hover:text-yellow-400 transition">Contact</a>
          <a href="#policy" className="hover:text-yellow-400 transition">Returns</a>
        </nav>
        <div className="flex items-center gap-2">
          {!user.loggedIn ? (
            <button onClick={()=>setAuthOpen(true)} className="hidden sm:inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs hover:border-yellow-500 hover:text-yellow-400">
              <User size={16} /> Login / Signup
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-300">
              <span className="rounded-full border border-neutral-800 bg-neutral-900 px-2 py-1">{user.name} • {user.role}</span>
              <button onClick={onLogout} className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 hover:border-yellow-500"><LogOut size={14}/>Logout</button>
            </div>
          )}
          <button onClick={() => setDrawer(true)} className="relative p-2 rounded-md hover:bg-neutral-900" aria-label="Open cart">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-yellow-500 text-black text-[10px] font-bold grid place-items-center px-1">
                {cart.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-900 px-4 pb-3">
          <div className="flex flex-col py-2 text-sm">
            <button onClick={()=>{setActiveView('shop');setOpen(false);}} className="py-2 text-left">Shop</button>
            {canAccessAdmin && <button onClick={()=>{setActiveView('admin');setOpen(false);}} className="py-2 text-left">Admin</button>}
            <a href="#about" className="py-2">About</a>
            <a href="#contact" className="py-2">Contact</a>
            <a href="#policy" className="py-2">Returns</a>
            {!user.loggedIn ? (
              <button onClick={()=>setAuthOpen(true)} className="mt-2 inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs w-max">
                <User size={16} /> Login / Signup
              </button>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-neutral-400">{user.name} • {user.role}</span>
                <button onClick={onLogout} className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs"><LogOut size={14}/>Logout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-neutral-950 border-l border-neutral-900 shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <button onClick={() => setDrawer(false)} className="p-2 hover:bg-neutral-900 rounded-md" aria-label="Close cart"><X size={20} /></button>
            </div>
            <div className="mt-4 flex-1 overflow-auto space-y-4 pr-1">
              {cart.length === 0 && (
                <p className="text-neutral-400">Your cart is empty. Start shopping to add items.</p>
              )}
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 border border-neutral-900 rounded-lg p-3">
                  <img src={item.images[0]} alt={item.name} className="h-16 w-16 rounded object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-neutral-400">{item.category}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 rounded hover:bg-neutral-900"><X size={14} /></button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.qty}
                          onChange={(e) => updateQty(item.id, Number(e.target.value), item.stock)}
                          className="w-16 rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-sm"
                        />
                        <span className="text-xs text-neutral-500">in stock: {item.stock}</span>
                      </div>
                      <div className="text-sm">
                        ₹{Math.round(item.price * (1 - (item.discount || 0) / 100)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-900 pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 hover:border-yellow-500">Cash on Delivery</button>
                <button className="rounded-md bg-yellow-500 text-black font-semibold px-3 py-2 hover:bg-yellow-400 flex items-center justify-center gap-2">
                  <Shield size={16} /> Secure Pay
                </button>
              </div>
              <p className="text-xs text-neutral-500">Demo checkout. Integrate Razorpay/Stripe on backend for production.</p>
            </div>
          </aside>
        </div>
      )}

      <AuthDialog open={authOpen} onClose={()=>setAuthOpen(false)} onLogin={onLogin} />
    </header>
  );
}
