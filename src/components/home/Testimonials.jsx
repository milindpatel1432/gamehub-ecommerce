import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { reviews } from '../../data/reviews';

export default function Testimonials() {

  return (
    <section className="bg-gaming-black py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-gaming text-3xl font-extrabold tracking-wide text-white">
            The Elite Community
          </h2>
          <div className="h-1 w-20 bg-gaming-cyan mx-auto mt-3 rounded-full" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card flex flex-col justify-between p-8 rounded-2xl border border-gaming-border bg-gaming-card/40 relative"
            >
              <Quote className="absolute top-6 right-8 h-8 w-8 text-gaming-cyan/15 pointer-events-none" />

              <div className="space-y-4 text-left">
                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-300 text-[15px] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 border-t border-gaming-border/40 mt-6 pt-5">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-gaming-cyan/35"
                />
                <div className="text-left">
                  <h4 className="font-gaming text-sm font-bold text-white tracking-wide">
                    {rev.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {rev.role}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
