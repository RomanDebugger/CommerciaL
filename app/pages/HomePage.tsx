'use client';
import { 
  Search,ArrowRight, ChevronLeft, ChevronRight, Smartphone, Shirt, 
  Home, Sparkles, ToyBrick, Dumbbell, Car, Gem, BookOpen, 
  HeartPulse, ShoppingBasket, Briefcase, Dog, Activity, 
  Luggage, Palette, Music, Hammer 
} from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';

const UserHome = () => {
  return (
    <>
    <section className="relative w-full h-[600px]">
      <img
        src="/Hero-Section.jpg"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 max-w-2xl px-6 md:px-16 top-1/4">
        <h6 className="mb-4 text-lg md:text-xl text-slate-200 drop-shadow-sm font-light">
          Welcome to the Future of Shopping
        </h6>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md leading-snug">
          <span className="text-white">Smarter. </span>
          <span className="bg-gradient-to-r from-gr1 to-gr2 bg-clip-text text-transparent">
            <Typewriter
              words={['Faster.', 'Cheaper.', 'Personalized.', 'Made for You.']}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={75}
              deleteSpeed={50}
              delaySpeed={1400}
            />
          </span>
        </h1>
      </div>

      <div className="absolute bottom-40 z-10 px-6 md:px-16 lg:w-200 md:w-100 w-50">
        <div className="w-full flex items-center gap-2 
          backdrop-blur-md bg-white/10 border border-white/20 
          rounded-2xl px-5 py-4 shadow-lg">
          <Search className="text-purple-400" />
          <input
            type="text"
            placeholder="Search for products, brands, or categories..."
            className="w-full bg-transparent outline-none text-white placeholder-gray-300 text-lg tracking-wide"
          />
        </div>
      </div>
    </section>
    

    <section className="relative w-full px-6 md:px-16 mt-[-60px] z-20">
  <div className="relative w-full h-auto">
    <div className="absolute grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
      
      {/* Fast Delivery */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md p-6 h-[220px] flex flex-col justify-between hover:shadow-lg transition">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">⚡ Fast & Reliable Delivery</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Orders shipped within 24 hours. Track every move, from warehouse to doorstep.
          </p>
        </div>
        <button className="mt-4 text-purple-600 text-sm font-semibold hover:underline">Track Orders →</button>
      </div>

      {/* Payment Security */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md p-6 h-[220px] flex flex-col justify-between hover:shadow-lg transition">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">🔐 Trusted & Secure Payments</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            All transactions are encrypted with AES-256. Pay with confidence via UPI, cards, or wallets.
          </p>
        </div>
        <button className="mt-4 text-purple-600 text-sm font-semibold hover:underline">Learn About Security →</button>
      </div>

      {/* 24/7 Support */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md p-6 h-[220px] flex flex-col justify-between hover:shadow-lg transition">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">🛎️ 24/7 Live Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Talk to real humans. Chat, call, or email anytime — we're always here to help.
          </p>
        </div>
        <button className="mt-4 text-purple-600 text-sm font-semibold hover:underline">Contact Us →</button>
      </div>

      {/* Trending Offers */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md p-6 h-[220px] flex flex-col justify-between hover:shadow-lg transition">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">🔥 Trending Today</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            See what's hot — top-selling items flying off the shelves. Limited-time deals daily.
          </p>
        </div>
        <button className="mt-4 text-purple-600 text-sm font-semibold hover:underline">View Top Picks →</button>
      </div>

    </div>
  </div>
</section>

    <section className="relative w-full mt-80 px-6 md:px-16">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Shop by Category</h2>
    <button className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium">
      View all categories
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>

  {/* Navigation Buttons */}
  <div className="relative z-20 flex justify-end gap-2 mb-4">
  {/* Scroll Left */}
  <button
    type="button"
    onClick={() =>
      document.getElementById('categorySlider')?.scrollBy({
        left: -300,
        behavior: 'smooth',
      })
    }
    aria-label="Scroll left"
    className="p-2 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100
               dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 
               text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 
               focus:ring-purple-500 transition absolute left-0"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>

  {/* Scroll Right */}
  <button
    type="button"
    onClick={() =>
      document.getElementById('categorySlider')?.scrollBy({
        left: 300,
        behavior: 'smooth',
      })
    }
    aria-label="Scroll right"
    className="p-2 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100
               dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 
               text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 
               focus:ring-purple-500 transition"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
</div>

  {/* Categories Grid */}
  <div
    id="categorySlider"
    className="flex gap-5 overflow-x-auto no-scrollbar py-4 px-1 scroll-smooth"
  >
    {[
      { name: 'Electronics', icon: <Smartphone className="w-6 h-6" /> },
      { name: 'Fashion', icon: <Shirt className="w-6 h-6" /> },
      { name: 'Home & Garden', icon: <Home className="w-6 h-6" /> },
      { name: 'Beauty', icon: <Sparkles className="w-6 h-6" /> },
      { name: 'Toys & Kids', icon: <ToyBrick className="w-6 h-6" /> },
      { name: 'Sports', icon: <Dumbbell className="w-6 h-6" /> },
      { name: 'Automotive', icon: <Car className="w-6 h-6" /> },
      { name: 'Jewelry', icon: <Gem className="w-6 h-6" /> },
      { name: 'Books', icon: <BookOpen className="w-6 h-6" /> },
      { name: 'Health', icon: <HeartPulse className="w-6 h-6" /> },
      { name: 'Groceries', icon: <ShoppingBasket className="w-6 h-6" /> },
      { name: 'Office', icon: <Briefcase className="w-6 h-6" /> },
      { name: 'Pets', icon: <Dog className="w-6 h-6" /> },
      { name: 'Fitness', icon: <Activity className="w-6 h-6" /> },
      { name: 'Travel', icon: <Luggage className="w-6 h-6" /> },
      { name: 'Art', icon: <Palette className="w-6 h-6" /> },
      { name: 'Music', icon: <Music className="w-6 h-6" /> },
      { name: 'DIY', icon: <Hammer className="w-6 h-6" /> },
    ].map((category, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center justify-center min-w-[140px] h-[140px] p-4
        rounded-xl border border-gray-200 dark:border-slate-700 text-center
        hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer 
        bg-white dark:bg-slate-900 hover:-translate-y-1 group"
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/30 mb-3 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
          <span className="text-purple-600 dark:text-purple-400">
            {category.icon}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {category.name}
        </p>
      </div>
    ))}
  </div>
</section>
    </>
  );
};

export default UserHome;
