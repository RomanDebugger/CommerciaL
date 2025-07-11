import SellerAside from '@/app/components/Seller/SellerAside';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row w-full min-h-screen">
      <SellerAside />
      <main
        className={`
          flex-1 
          overflow-x-auto 
          p-4 
          pb-20 sm:pb-0
        `}
      >
        
        {children}
      </main>
    </div>
  );
}
