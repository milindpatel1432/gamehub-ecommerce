import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FrequentlyBought({ onAddProduct }) {
  const products = [
    {
      id: 301,
      title: 'DualSense Edge Wireless',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 302,
      title: 'Pulse Elite Wireless Headset',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 303,
      title: 'DualSense Charging Station',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <h3 className="font-gaming text-lg font-bold text-white tracking-wider">
        Frequently Bought Together
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/45 overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden bg-gaming-black/25">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Info details */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-gaming text-xs font-bold text-white tracking-wide truncate max-w-[130px]" title={prod.title}>
                  {prod.title}
                </h4>
                <p className="text-sm font-bold text-gaming-cyan font-gaming">
                  ${prod.price.toFixed(2)}
                </p>
              </div>

              {/* Add to cart icon button */}
              <button
                onClick={() => onAddProduct(prod)}
                className="w-9 h-9 rounded-xl bg-gaming-border/80 hover:bg-gaming-accent text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
