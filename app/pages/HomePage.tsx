'use client';
import { 
  ArrowRight, ChevronLeft, ChevronRight, Smartphone, Shirt, 
  Home, Sparkles, ToyBrick, Dumbbell, Car, Gem, BookOpen, 
  HeartPulse, ShoppingBasket, Briefcase, Dog, Activity, 
  Luggage, Palette, Music, Hammer 
} from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const UserHome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const categorySliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const heroSection = document.querySelector('#hero-section');
    if (heroSection) observer.observe(heroSection);

    return () => {
      if (heroSection) observer.unobserve(heroSection);
    };
  }, []);
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categorySliderRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 200;
      categorySliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
     <section 
      id="hero-section"
      className="relative w-full h-[300px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-r from-gr1 to-gr2 sm:bg-none"
    >
      <Image
        src="/Hero-Section.jpg"
        alt="Hero"
        className="hidden sm:block absolute w-full h-full object-cover"
        loading="eager"
        width={1920}
        height={600}
      />
      <div 
        className={`relative z-10 max-w-2xl px-4 sm:px-6 md:px-16 h-full flex flex-col justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <h6 className="mb-3 sm:mb-4 text-base sm:text-lg md:text-xl text-white sm:text-slate-200 drop-shadow-sm font-light">
          Welcome to the Future of Shopping
        </h6>

        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-md leading-snug">
          <span className="text-white">Smarter. </span>
          <span className="bg-gradient-to-r from-white to-gray-200 sm:from-gr1 sm:to-gr2 bg-clip-text text-transparent">
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
      
    </section>
      
      <section className="relative w-full px-4 sm:px-6 md:px-16 mt-[-40px] sm:mt-[-60px] z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {[
            {
              title: "⚡ Fast & Reliable Delivery",
              description: "Orders shipped within 24 hours. Track every move, from warehouse to doorstep.",
              cta: "Track Orders →"
            },
            {
              title: "🔐 Trusted & Secure Payments",
              description: "All transactions are encrypted with AES-256. Pay with confidence.",
              cta: "Learn About Security →"
            },
            {
              title: "🛎️ 24/7 Live Support",
              description: "Talk to real humans. Chat, call, or email anytime — we are always here to help.",
              cta: "Contact Us →"
            },
            {
              title: "🔥 Trending Today",
              description: "See what's hot — top-selling items flying off the shelves. Limited-time deals daily.",
              cta: "View Top Picks →"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md p-4 sm:p-6 h-full min-h-[180px] sm:min-h-[220px] flex flex-col justify-between hover:shadow-lg transition hover:-translate-y-1"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <button 
                className="mt-3 sm:mt-4 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold hover:underline text-left"
                aria-label={feature.cta.replace('→', '')}
              >
                {feature.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full mt-16 sm:mt-24 px-4 sm:px-6 md:px-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Shop by Category
          </h2>
          <button 
            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
            aria-label="View all categories"
          >
            View all categories
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center absolute top-1/2 transform -translate-y-1/2 w-full z-10 px-2">
            <button
              onClick={() => scrollCategories('left')}
              aria-label="Scroll categories left"
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              aria-label="Scroll categories right"
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div
            ref={categorySliderRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-2 sm:py-4 px-1 scroll-smooth"
          >
            {[
              { name: 'Electronics', icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Fashion', icon: <Shirt className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Home', icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Beauty', icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Toys', icon: <ToyBrick className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Sports', icon: <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Auto', icon: <Car className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Jewelry', icon: <Gem className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Books', icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Health', icon: <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Groceries', icon: <ShoppingBasket className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Office', icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Pets', icon: <Dog className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Fitness', icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Travel', icon: <Luggage className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Art', icon: <Palette className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'Music', icon: <Music className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { name: 'DIY', icon: <Hammer className="w-5 h-5 sm:w-6 sm:h-6" /> },
            ].map((category, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px] h-[100px] sm:h-[120px] md:h-[140px] p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-center hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900 hover:-translate-y-1 group flex-shrink-0"
                role="button"
                tabIndex={0}
                aria-label={`Browse ${category.name} category`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/30 mb-2 sm:mb-3 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                  <span className="text-purple-600 dark:text-purple-400">
                    {category.icon}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default UserHome;