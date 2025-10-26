import { Tag } from 'lucide-react';

function ProductCard({ p, addToCart }) {
  const discounted = Math.round(p.price * (1 - (p.discount || 0) / 100));
  const hasDiscount = p.discount && p.discount > 0;

  return (
    <div className="group rounded-xl border border-neutral-900 bg-neutral-950 overflow-hidden hover:border-yellow-600/40 transition">
      <div className="relative aspect-square overflow-hidden">
        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        {p.label && (
          <span className="absolute left-2 top-2 rounded-full bg-yellow-500 text-black text-[10px] font-bold px-2 py-1">{p.label}</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold leading-tight">{p.name}</h3>
            <p className="text-xs text-neutral-400">{p.category}</p>
          </div>
          {hasDiscount && (
            <span className="inline-flex items-center gap-1 text-[10px] text-yellow-400"><Tag size={12} /> {p.discount}% off</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold">₹{discounted.toLocaleString('en-IN')}</span>
          {hasDiscount && <span className="text-xs text-neutral-500 line-through">₹{p.price.toLocaleString('en-IN')}</span>}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => addToCart(p)} className="rounded-md bg-yellow-500 text-black font-semibold px-3 py-2 hover:bg-yellow-400 text-sm">Add to Cart</button>
          <span className={`${p.stock > 0 ? 'text-emerald-400' : 'text-red-400'} text-xs`}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, addToCart }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      {products.length === 0 ? (
        <p className="text-neutral-400">No products match your filters. Try adjusting your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
