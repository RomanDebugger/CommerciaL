import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  title: "Commercial",
  description: "A next generation commerce platform",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Toaster position="top-right"/>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}