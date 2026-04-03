import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function Hero() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHAT_URL || '#';

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-terracotta-100 via-cream to-terracotta-50" />

      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-terracotta-200/40 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-terracotta-300/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-gold-400/20 blur-2xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-terracotta-100 text-terracotta-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🌸</span>
            <span>Handcrafted with Love</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-terracotta-800 leading-tight mb-6">
            Wear the{' '}
            <span className="text-terracotta-500 italic">Earth's</span>
            <br />
            Beauty
          </h1>

          <p className="text-lg text-terracotta-600 leading-relaxed mb-8 max-w-xl">
            Each piece of Sparkle Sisterz jewellery is lovingly handcrafted from pure terracotta clay —
            earthy, elegant, and uniquely yours. From necklaces to jhumkas, discover wearable art that tells your story.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary text-base">
              Shop Now <ArrowRight size={18} />
            </Link>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-base">
              <MessageCircle size={18} /> Chat with Us
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            {[
              { value: '500+', label: 'Happy Customers' },
              { value: '100%', label: 'Handcrafted' },
              { value: '50+', label: 'Unique Designs' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold font-serif text-terracotta-700">{stat.value}</div>
                <div className="text-sm text-terracotta-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="#fdf8f3"
          />
        </svg>
      </div>
    </section>
  );
}
