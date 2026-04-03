import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Sparkle Sisterz — Handcrafted Terracotta Jewellery',
  description:
    'Discover unique handcrafted terracotta jewellery — necklaces, earrings, bracelets, rings and more. Shop beautiful artisan pieces crafted with love.',
  keywords: 'terracotta jewellery, handcrafted jewelry, terracotta necklace, clay jewelry, artisan jewelry, Sparkle Sisterz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#c4622d',
                color: '#fff',
                borderRadius: '12px',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
