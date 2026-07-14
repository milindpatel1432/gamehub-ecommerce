import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { consoles } from '../../data/consoles';

export default function PopularConsoles() {
  const navigate = useNavigate();

  return (
    <section className="bg-gaming-dark py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-gaming text-3xl font-extrabold tracking-wide text-white">
            Next-Gen Consoles
          </h2>
          <p className="text-sm text-slate-400 mt-2">The power of elite gaming at your fingertips</p>
          <div className="h-1 w-20 bg-gaming-cyan mx-auto mt-3 rounded-full" />
        </div>

        {/* Consoles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {consoles.map((console, index) => (
            <motion.div
              key={console.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`glass-card flex flex-col rounded-3xl border border-gaming-border bg-gaming-card/60 p-6 transition-all duration-300 ${console.glowColor}`}
            >
              {/* Product Image */}
              <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden bg-gaming-black/40">
                <img
                  src={console.image}
                  alt={console.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Desc */}
              <div className="text-left space-y-3 flex-1">
                <h3 className="font-gaming text-xl font-bold text-white tracking-wide">
                  {console.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {console.description}
                </p>
              </div>

              {/* Specs/Prices grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-gaming-border/60 my-6 py-4 text-left">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Buy New</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <p className="text-base font-bold text-white">{console.buyPrice}</p>
                    <span className="text-[9px] text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                      {console.buyStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Rent Monthly</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <p className="text-base font-bold text-gaming-cyan">{console.rentPrice}</p>
                    <span className="text-[9px] text-gaming-cyan font-bold bg-gaming-cyan/10 px-1.5 py-0.5 rounded">
                      {console.rentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => navigate('/shop')}
                className="w-full h-12 rounded-xl bg-gaming-accent text-white hover:bg-gaming-cyan hover:text-gaming-black font-semibold text-sm hover:shadow-[0_0_15px_rgba(0,136,255,0.4)] transition-all duration-300 cursor-pointer"
              >
                {console.actionText}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
