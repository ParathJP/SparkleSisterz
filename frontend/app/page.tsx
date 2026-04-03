import Link from 'next/link';
import { ArrowRight, Instagram, Youtube, MessageCircle, Star } from 'lucide-react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products?featured=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const CATEGORIES = [
  { name: 'Necklaces', emoji: '📿', color: 'from-terracotta-300 to-terracotta-500' },
  { name: 'Earrings',  emoji: '✨', color: 'from-terracotta-200 to-terracotta-400' },
  { name: 'Bracelets', emoji: '💫', color: 'from-amber-300 to-terracotta-400' },
  { name: 'Rings',     emoji: '💍', color: 'from-terracotta-400 to-terracotta-600' },
  { name: 'Anklets',   emoji: '🌿', color: 'from-orange-200 to-terracotta-300' },
  { name: 'Sets',      emoji: '🎁', color: 'from-terracotta-300 to-terracotta-700' },
];

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    text: "I ordered the floral necklace and it's absolutely stunning! The quality is amazing and the packaging was so cute. Will definitely order again.",
    rating: 5,
  },
  {
    name: 'Ananya M.',
    text: "The jhumka earrings are so lightweight yet beautiful. I get compliments every time I wear them. Love Sparkle Sisterz!",
    rating: 5,
  },
  {
    name: 'Kavitha R.',
    text: "Ordered the festival jewellery set for my daughter's event. Everyone loved it! Unique and very well made.",
    rating: 5,
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
  const youtube = process.env.NEXT_PUBLIC_YOUTUBE_URL || '#';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHAT_URL || '#';

  return (
    <>
      <Hero />

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-terracotta-400 uppercase tracking-widest text-sm font-medium mb-2">Handpicked For You</p>
            <h2 className="section-heading">Featured Pieces</h2>
          </div>
          <Link href="/products" className="btn-secondary text-sm self-start sm:self-auto">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-terracotta-400">
            <span className="text-5xl">🌸</span>
            <p className="mt-4 text-lg">Products coming soon. Stay tuned!</p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-16 bg-terracotta-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-terracotta-400 uppercase tracking-widest text-sm font-medium mb-2">Browse By</p>
            <h2 className="section-heading">Shop Categories</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl md:text-3xl shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}
                >
                  {cat.emoji}
                </div>
                <span className="text-xs md:text-sm font-medium text-terracotta-700 text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About / Story */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-terracotta-200 via-terracotta-300 to-terracotta-500 flex items-center justify-center">
              <span className="text-8xl">🌸</span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-400 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              🏺
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-terracotta-400 uppercase tracking-widest text-sm font-medium mb-3">Our Story</p>
            <h2 className="section-heading mb-6">Crafted With Earth, Worn With Pride</h2>
            <p className="text-terracotta-600 leading-relaxed mb-4">
              Sparkle Sisterz was born from a deep love for traditional Indian art and the timeless beauty of terracotta craft.
              Every piece we create is hand-moulded, painted, and finished with care — no two pieces are exactly alike.
            </p>
            <p className="text-terracotta-600 leading-relaxed mb-8">
              We believe jewellery should tell a story. From the rich earthy tones of our clay to the intricate hand-painted
              motifs, each Sparkle Sisterz piece carries a piece of our heart. Lightweight, eco-friendly, and uniquely beautiful.
            </p>
            <div className="flex flex-wrap gap-3">
              {['100% Handcrafted', 'Eco-friendly', 'Unique Designs', 'Lightweight'].map((tag) => (
                <span key={tag} className="bg-terracotta-100 text-terracotta-600 px-4 py-1.5 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-terracotta-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-terracotta-300 uppercase tracking-widest text-sm font-medium mb-2">What They Say</p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white">Happy Customers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-terracotta-700/50 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-terracotta-100 leading-relaxed mb-4 text-sm">"{t.text}"</p>
                <p className="text-gold-400 font-medium text-sm">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social / Connect */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <p className="text-terracotta-400 uppercase tracking-widest text-sm font-medium mb-3">Find Us On</p>
        <h2 className="section-heading mb-4">Connect With Sparkle Sisterz</h2>
        <p className="text-terracotta-500 mb-10 max-w-lg mx-auto">
          Follow us for new designs, behind-the-scenes content, and exclusive offers!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <Instagram size={20} /> Instagram
          </a>
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            <Youtube size={20} /> YouTube
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={20} /> WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
