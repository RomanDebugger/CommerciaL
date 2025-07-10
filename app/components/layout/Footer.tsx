'use client';
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isSellerRoute = pathname?.startsWith('/seller') ?? false;
  
  if (isSellerRoute) return null;

  return (
    <footer className="w-full mt-auto bg-black text-gray-400 border-t border-gray-800 px-6 md:px-16 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Commercia<span className="text-purple-500">L</span>
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md">
            Built for the bold. We're redefining how the world shops — smarter, faster, and more secure. 
            Join millions rewriting the future of commerce.
          </p>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-purple-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Careers</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Press</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-purple-400 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Returns & Refunds</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-xs text-gray-600 text-center border-t border-gray-800 pt-6">
        © {new Date().getFullYear()} <span className="font-semibold text-purple-500">CommerciaL</span> — All rights reserved.
      </div>
    </footer>
  );
}