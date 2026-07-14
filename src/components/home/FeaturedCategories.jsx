import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/categories';

export default function FeaturedCategories() {
  const navigate = useNavigate();

  return (
    <section className="bg-gaming-dark py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="text-left mb-12">
          <h2 className="font-gaming text-3xl font-extrabold tracking-wide text-white">
            Elite Categories
          </h2>
          <div className="h-1 w-20 bg-gaming-cyan mt-3 rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate('/shop')}
              className={`group relative h-72 rounded-2xl border border-gaming-border bg-gaming-card overflow-hidden cursor-pointer transition-all duration-300 ${cat.borderGlow}`}
            >
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-gaming-black via-gaming-black/40 to-transparent z-10" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/60 border border-gaming-cyan/30 rounded-full px-2.5 py-1 backdrop-blur-sm">
                  {cat.badge}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 z-20 text-left space-y-1">
                <h3 className="font-gaming text-lg font-bold text-white group-hover:text-gaming-cyan transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {cat.subtitle}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
