export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950" id="about">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold">About A to Z Collection</h3>
          <p className="mt-3 text-neutral-400 max-w-prose">
            We curate premium products across fashion, electronics, accessories, home lifestyle, and kids. Our mission is to bring a minimal, modern, and reliable shopping experience with secure checkout and transparent policies.
          </p>
        </div>
        <div id="contact">
          <h4 className="font-semibold">Contact Us</h4>
          <ul className="mt-3 text-sm text-neutral-400 space-y-2">
            <li>Email: support@atozcollection.com</li>
            <li>Phone: +91-98765-43210</li>
            <li>Hours: Mon-Sat, 10am - 7pm</li>
          </ul>
        </div>
        <div id="policy">
          <h4 className="font-semibold">Returns & Policy</h4>
          <ul className="mt-3 text-sm text-neutral-400 space-y-2">
            <li>7-day return window for eligible items</li>
            <li>Original packaging required</li>
            <li>Refunds processed within 3-5 business days</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} A to Z Collection. All rights reserved.</p>
          <p className="text-xs text-neutral-500">Design theme: Black • Gold • White</p>
        </div>
      </div>
    </footer>
  );
}
