import SellerAside from '@/app/components/Seller/SellerAside';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <SellerAside />
      <div className="flex-1">{children}</div>
    </main>
  );
}
