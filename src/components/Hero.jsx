import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[72vh] w-full" id="top">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 pointer-events-none" />
      <div className="relative z-10 h-full">
        <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full border border-yellow-600/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-yellow-400 uppercase">Premium • Modern • Minimal</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
              A to Z Collection
            </h1>
            <p className="mt-4 text-neutral-300 max-w-xl">
              Discover curated fashion, electronics, and lifestyle picks. New Arrivals and Best Deals updated weekly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#shop" className="rounded-md bg-yellow-500 text-black font-semibold px-5 py-3 hover:bg-yellow-400">Shop Now</a>
              <a href="#about" className="rounded-md border border-neutral-800 bg-neutral-900 px-5 py-3 hover:border-yellow-500">About Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
