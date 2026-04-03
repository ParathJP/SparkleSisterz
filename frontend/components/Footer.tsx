import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
  const youtube = process.env.NEXT_PUBLIC_YOUTUBE_URL || '#';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHAT_URL || '#';

  return (
    <footer className="bg-terracotta-900 text-terracotta-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="Sparkle Sisterz" width={40} height={40} className="object-contain" />
              <div>
                <span className="font-serif text-xl font-bold text-white block leading-none">Sparkle Sisterz</span>
                <span className="text-xs text-terracotta-300 tracking-widest uppercase">Terracotta Jewellery</span>
              </div>
            </div>
            <p className="text-terracotta-300 text-sm leading-relaxed">
              Handcrafted with love, each piece tells a unique story. Earthy, elegant, and entirely one-of-a-kind.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Shop All' },
                { href: '/cart', label: 'My Cart' },
                { href: '/#about', label: 'About Us' },
                { href: '/#contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-terracotta-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex flex-col gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-terracotta-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
                <span className="text-sm">Follow on Instagram</span>
              </a>
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-terracotta-300 hover:text-white transition-colors"
              >
                <Youtube size={20} />
                <span className="text-sm">Watch on YouTube</span>
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-terracotta-300 hover:text-white transition-colors"
              >
                <MessageCircle size={20} />
                <span className="text-sm">Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-terracotta-700 text-center text-terracotta-400 text-sm">
          © {new Date().getFullYear()} Sparkle Sisterz. All rights reserved. Made with ❤️ for terracotta lovers.
        </div>
      </div>
    </footer>
  );
}
