import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  ShieldCheck,
  Zap,
  Users,
  Truck,
  Lock,
  Headphones,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award,
  Shield,
  Heart,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Star,
  Check
} from 'lucide-react';

export default function About() {
  // Animated Counter Logic
  const [counts, setCounts] = useState({
    gamers: 0,
    products: 0,
    brands: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 50;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        gamers: Math.floor(progress * 50000),
        products: Math.floor(progress * 15000),
        brands: Math.floor(progress * 100),
        satisfaction: Math.floor(progress * 99),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          gamers: 50000,
          products: 15000,
          brands: 100,
          satisfaction: 99,
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Why Choose GameHub 7 Feature Cards
  const whyChooseFeatures = [
    {
      icon: ShieldCheck,
      title: 'Premium Products',
      description: 'Hand-picked 100% genuine gaming gear, next-gen consoles, and AAA titles from certified manufacturers.',
      glow: 'hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] hover:border-gaming-cyan/50',
      iconColor: 'text-gaming-cyan',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'Bank-grade 256-bit SSL encrypted checkout supporting Razorpay, UPI, credit cards, and instant net banking.',
      glow: 'hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:border-green-500/50',
      iconColor: 'text-green-400',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Express door-step dispatch with real-time GPS tracking and insured transit on all console orders.',
      glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:border-purple-500/50',
      iconColor: 'text-purple-400',
    },
    {
      icon: Headphones,
      title: '24/7 Pro Support',
      description: 'Dedicated round-the-clock gamer support team via live chat, Discord, and instant email assistance.',
      glow: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] hover:border-pink-500/50',
      iconColor: 'text-pink-400',
    },
    {
      icon: CheckCircle2,
      title: 'Verified Sellers',
      description: 'Rigorous 10-point verification audit for all marketplace vendors to ensure zero counterfeit products.',
      glow: 'hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:border-yellow-500/50',
      iconColor: 'text-yellow-400',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Hassle-free 7-day return policy and quick refund processing for complete peace of mind.',
      glow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:border-blue-500/50',
      iconColor: 'text-blue-400',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by gamers, for gamers. Integrated user reviews, rental sharing, and active community forums.',
      glow: 'hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] hover:border-teal-500/50',
      iconColor: 'text-teal-400',
    },
  ];

  // Core Values (4 Cards)
  const coreValues = [
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Pioneering flexible rental plans and instant digital marketplace access for gamers worldwide.',
      border: 'border-gaming-cyan/40',
      bgGlow: 'from-gaming-cyan/10 to-transparent',
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Uncompromising standard for authentic AAA titles, top-shelf PC components, and pristine console condition.',
      border: 'border-purple-500/40',
      bgGlow: 'from-purple-500/10 to-transparent',
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Transparent pricing, secure transaction gateways, and reliable customer satisfaction policies.',
      border: 'border-green-500/40',
      bgGlow: 'from-green-500/10 to-transparent',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Fostering an inclusive, passion-fueled global community of passionate gaming enthusiasts.',
      border: 'border-pink-500/40',
      bgGlow: 'from-pink-500/10 to-transparent',
    },
  ];

  // Team Members
  const teamMembers = [
    {
      name: 'Alex Mercer',
      role: 'CEO & Founder',
      badge: 'Visionary',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Ex-esports pro with 12+ years of gaming industry leadership.',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Frontend Lead',
      badge: 'UI Architect',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      bio: 'Crafts high-performance React & WebGL interfaces for GameHub.',
    },
    {
      name: 'David Chen',
      role: 'Principal Backend Lead',
      badge: 'System Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Scales cloud architecture, real-time APIs, and MongoDB clusters.',
    },
    {
      name: 'Marcus Vance',
      role: 'Customer Success',
      badge: 'Gamer Advocate',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Ensures top-tier gamer satisfaction and instant resolution.',
    },
    {
      name: 'Elena Rostova',
      role: 'Lead UI/UX Designer',
      badge: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      bio: 'Pioneers futuristic dark-mode gaming aesthetics and design systems.',
    },
  ];

  // Journey Timeline
  const journeyTimeline = [
    {
      year: '2024',
      title: 'GameHub Founded',
      description: 'Started with a vision to revolutionize how gamers buy and rent AAA titles and consoles.',
      status: 'Completed',
    },
    {
      year: '2025',
      title: 'Marketplace Launch',
      description: 'Expanded catalog with 100+ top brands, rental subscriptions, and instant digital checkout.',
      status: 'Completed',
    },
    {
      year: '2026',
      title: '10,000+ Happy Customers',
      description: 'Crossed 50k active gamers across the country with a 99% customer satisfaction rate.',
      status: 'Active Milestone',
    },
    {
      year: 'Future',
      title: 'Global Expansion',
      description: 'Bringing cloud rental streaming and global hardware distribution to esports arenas worldwide.',
      status: 'Upcoming',
    },
  ];

  // Partner Brands
  const partnerBrands = [
    { name: 'Sony', label: 'PlayStation' },
    { name: 'Microsoft', label: 'Xbox' },
    { name: 'Nintendo', label: 'Switch' },
    { name: 'Logitech', label: 'Logitech G' },
    { name: 'Razer', label: 'Razer' },
    { name: 'ASUS', label: 'ROG' },
    { name: 'MSI', label: 'MSI Gaming' },
    { name: 'Corsair', label: 'Corsair' },
    { name: 'HyperX', label: 'HyperX' },
    { name: 'SteelSeries', label: 'SteelSeries' },
    { name: 'Samsung', label: 'Odyssey' },
    { name: 'WD', label: 'WD_BLACK' },
  ];

  return (
    <div className="w-full bg-gaming-dark text-slate-200 min-h-screen overflow-hidden">
      
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gradient-to-b from-gaming-black via-gaming-dark to-gaming-dark">
        {/* Neon Glow Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gaming-cyan/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gaming-purple/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center space-y-8 relative z-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gaming-cyan/40 bg-gaming-cyan/10 px-4 py-1.5 text-xs font-bold text-gaming-cyan tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            <Gamepad2 className="h-4 w-4" />
            About GameHub
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-gaming text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight"
          >
            Powering the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan via-gaming-accent to-gaming-purple">Gaming</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            GameHub is the ultimate AAA gaming destination built for passionate players. Discover, buy, and rent top-tier consoles, blockbuster titles, and high-performance PC hardware with total confidence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/shop"
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-gaming-cyan to-gaming-accent text-gaming-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Store</span>
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#contact"
              className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-gaming-border hover:border-gaming-cyan bg-gaming-card/60 text-white font-bold text-sm tracking-wide hover:bg-gaming-card hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Contact Us
            </a>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          2. WHO WE ARE
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gaming-cyan">
                <Users className="h-4 w-4" />
                Who We Are
              </div>
              <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide leading-tight">
                Built by Gamers, Dedicated to the Global Gaming Community
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Founded with an unyielding passion for interactive entertainment, GameHub has grown into a trusted digital marketplace where thousands of gamers find authentic gear and flex rental options.
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you’re looking to own the latest PlayStation 5, rent a high-end graphics card for a weekend tournament, or build a custom liquid-cooled PC, GameHub delivers fast shipping, verified product quality, and 24/7 dedicated support.
              </p>

              {/* 6 Key Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  'Passion for Gaming',
                  'Trusted Marketplace',
                  'Gaming Community',
                  'Secure Shopping',
                  'Fast Delivery',
                  'Genuine Products',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
                    <div className="w-5 h-5 rounded-full bg-gaming-cyan/20 border border-gaming-cyan/40 flex items-center justify-center text-gaming-cyan flex-shrink-0">
                      <Check className="h-3 w-3 stroke-[3px]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Card / Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass-card rounded-3xl border border-gaming-border bg-gaming-card/45 p-8 relative overflow-hidden space-y-6 text-left shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gaming-cyan/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gaming-cyan/10 border border-gaming-cyan/30 flex items-center justify-center text-gaming-cyan">
                    <Zap className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-gaming text-lg font-bold text-white">100% Authentic Marketplace</h3>
                    <p className="text-xs text-slate-400">Directly sourced from authorized brand channels</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-gaming-border/60">
                  <div className="p-4 rounded-xl bg-gaming-black/60 border border-gaming-border/40 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Buy or Rent Guarantee</span>
                    <span className="text-gaming-cyan font-bold">100% Risk Free</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gaming-black/60 border border-gaming-border/40 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Verified Hardware Quality</span>
                    <span className="text-green-400 font-bold">10-Point Audit</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gaming-black/60 border border-gaming-border/40 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Customer Trust Score</span>
                    <span className="text-yellow-400 font-bold flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400" /> 4.9 / 5.0
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MISSION SECTION
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-gaming-cyan block mb-2">Our Core Purpose</span>
            <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              Our Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                title: 'Make Gaming Accessible',
                desc: 'Breaking cost barriers with flexible short-term and long-term rental options for every gamer.',
                icon: Gamepad2,
              },
              {
                title: 'Affordable Gaming',
                desc: 'Delivering competitive pricing, exclusive bundle deals, and seasonal discounts on AAA blockbusters.',
                icon: TrendingUp,
              },
              {
                title: 'Trusted Marketplace',
                desc: 'Ensuring seamless transactions, verified inventory, and consumer protection on every order.',
                icon: ShieldCheck,
              },
              {
                title: 'High Quality Hardware',
                desc: 'Partnering exclusively with world-renowned brands like Sony, Microsoft, Razer, and ASUS.',
                icon: Cpu,
              },
            ].map((mission, idx) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-gaming-border bg-gaming-card/60 space-y-4 hover:border-gaming-cyan/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/30 flex items-center justify-center text-gaming-cyan">
                  <mission.icon className="h-6 w-6" />
                </div>
                <h3 className="font-gaming text-base font-bold text-white tracking-wide">{mission.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{mission.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. WHY CHOOSE GAMEHUB (7 FEATURE CARDS)
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gaming-cyan">The GameHub Advantage</span>
            <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              Why Choose GameHub
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Everything you need for a premium, hassle-free gaming setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
            {whyChooseFeatures.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`glass-card p-6 rounded-2xl border border-gaming-border bg-gaming-card/60 space-y-4 transition-all duration-300 ${feat.glow}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gaming-black/60 border border-gaming-border/80 flex items-center justify-center ${feat.iconColor}`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-gaming text-base font-bold text-white tracking-wide">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. OUR NUMBERS (ANIMATED COUNTERS)
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gradient-to-r from-gaming-black via-gaming-card/40 to-gaming-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Happy Gamers', value: `${counts.gamers.toLocaleString()}+`, color: 'text-gaming-cyan' },
              { label: 'Products Catalog', value: `${counts.products.toLocaleString()}+`, color: 'text-purple-400' },
              { label: 'Partner Brands', value: `${counts.brands}+`, color: 'text-pink-400' },
              { label: 'Customer Satisfaction', value: `${counts.satisfaction}%`, color: 'text-green-400' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-gaming-border bg-gaming-card/50 text-center space-y-2"
              >
                <span className={`font-gaming text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight block ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. OUR VALUES
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-gaming-cyan block mb-2">Pillars of Excellence</span>
            <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {coreValues.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`glass-card p-8 rounded-3xl border ${val.border} bg-gradient-to-b ${val.bgGlow} space-y-4 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gaming-black/80 border border-gaming-border flex items-center justify-center text-white">
                  <val.icon className="h-6 w-6 text-gaming-cyan" />
                </div>
                <h3 className="font-gaming text-xl font-bold text-white tracking-wide">{val.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. OUR TEAM
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/30">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gaming-cyan">Meet the Creators</span>
            <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              Our Leadership Team
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Passionate gamers, engineers, and designers powering the GameHub experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card flex flex-col rounded-2xl border border-gaming-border bg-gaming-card/60 overflow-hidden hover:border-gaming-cyan/50 transition-all duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gaming-black">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 text-[9px] uppercase font-bold tracking-wider text-gaming-cyan bg-gaming-black/85 border border-gaming-cyan/30 rounded px-2 py-0.5">
                    {member.badge}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-gaming text-base font-bold text-white group-hover:text-gaming-cyan transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">{member.role}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal border-t border-gaming-border/40 pt-2">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. OUR JOURNEY (TIMELINE)
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-5xl text-center">
          
          <div className="mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-gaming-cyan block mb-2">Evolution</span>
            <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
              Our Journey
            </h2>
          </div>

          <div className="relative border-l-2 border-gaming-cyan/30 ml-4 sm:ml-32 space-y-12 text-left">
            {journeyTimeline.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative pl-8 sm:pl-10 group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-gaming-dark border-2 border-gaming-cyan group-hover:bg-gaming-cyan group-hover:shadow-[0_0_12px_rgba(0,229,255,0.8)] transition-all duration-300" />
                
                <div className="glass-card p-6 rounded-2xl border border-gaming-border bg-gaming-card/50 space-y-2 hover:border-gaming-cyan/40 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="font-gaming text-2xl font-bold text-gaming-cyan">{item.year}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-gaming-black/60 border border-gaming-border rounded px-2.5 py-0.5">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-gaming text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. PARTNER BRANDS
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl text-center">
          
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-gaming-cyan block mb-2">Global Alliance</span>
            <h2 className="font-gaming text-3xl font-extrabold text-white tracking-wide">
              Official Partner Brands
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {partnerBrands.map((brand) => (
              <div
                key={brand.name}
                className="glass-card h-24 rounded-2xl border border-gaming-border bg-gaming-card/40 flex flex-col items-center justify-center p-4 filter grayscale contrast-75 hover:grayscale-0 hover:border-gaming-cyan/60 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300 cursor-pointer group"
              >
                <span className="font-gaming font-extrabold text-lg text-slate-400 group-hover:text-white tracking-wider transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-600 group-hover:text-gaming-cyan transition-colors mt-0.5">
                  {brand.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          10. CALL TO ACTION
         ========================================================================= */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gaming-dark to-gaming-black">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-gaming-cyan/40 bg-gradient-to-r from-gaming-card via-gaming-black to-gaming-card p-10 sm:p-16 text-center space-y-8 shadow-[0_0_50px_rgba(0,229,255,0.15)]"
          >
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-gaming-cyan/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gaming-purple/20 rounded-full blur-3xl pointer-events-none" />

            <h2 className="font-gaming text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
              Ready to Level Up Your Gaming Experience?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Explore our massive catalog of AAA games, next-gen consoles, and pro hardware or get in touch with our expert gamer support team today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto h-14 px-10 rounded-full bg-gaming-cyan text-gaming-black hover:text-white hover:bg-gaming-accent font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,136,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <a
                href="mailto:support@gamehub.com"
                className="w-full sm:w-auto h-14 px-10 rounded-full border border-gaming-border hover:border-gaming-cyan bg-gaming-black/60 hover:bg-gaming-card text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                Contact Support
              </a>
            </div>

          </motion.div>
        </div>
      </section>

    </div>
  );
}
