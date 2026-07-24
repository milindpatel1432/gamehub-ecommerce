import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, PhoneCall, MessageSquare, MapPin, Clock, Send, Sparkles, 
  CheckCircle2, Share2, ShieldCheck, ChevronDown, Headphones, 
  Gamepad2, Users, ArrowRight, HelpCircle, Check
} from 'lucide-react';
import { supportChannels, inquiryTypes, officeLocations, contactFAQs } from '../../data/contactData';
import { successToast, errorToast } from '../../utils/toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      errorToast('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      successToast('Thank you! Your message has been sent successfully. Our team will get back to you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-slate-100 pb-20 overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Color Grading Matched to Consoles.jsx) */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-gaming-border overflow-hidden bg-gradient-to-b from-gaming-black via-gaming-dark to-gaming-dark">
        {/* Ambient Glowing Background Lights */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gaming-cyan/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gaming-accent/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Headphones className="w-3.5 h-3.5 text-gaming-cyan" /> 24/7 Dedicated Gamer Support
            </div>

            <h1 className="font-gaming text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              We Are Here To <br />
              <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-gaming-accent bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                Help You Play
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have questions about console rentals, order status, or technical support? Reach out to our gamer team via live chat, WhatsApp, or drop us a message below.
            </p>

            {/* Live Support Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-white">Live Chat Response &lt; 60s</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gaming-cyan" />
                <span className="font-semibold text-white">100% Guaranteed Resolution</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. SUPPORT CHANNELS GRID */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel) => (
              <motion.div
                key={channel.id}
                whileHover={{ y: -6 }}
                className={`glass-card relative rounded-2xl border ${channel.borderColor} bg-gradient-to-br ${channel.color} p-6 space-y-4 flex flex-col justify-between transition-all duration-300`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-gaming-black/60 border border-white/10 ${channel.textColor}`}>
                      {channel.badge}
                    </span>
                  </div>
                  <h3 className="font-gaming text-lg font-bold text-white">{channel.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{channel.description}</p>
                </div>

                <button
                  onClick={() => {
                    if (channel.id === 'whatsapp') {
                      window.open('https://wa.me/919876543210', '_blank');
                    } else if (channel.id === 'discord') {
                      window.open('https://discord.gg/gamehub', '_blank');
                    } else if (channel.id === 'email') {
                      window.location.href = 'mailto:support@gamehub.com';
                    } else {
                      successToast('Connecting to 24/7 Live Support Agent...');
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer bg-gaming-black/80 hover:bg-gaming-cyan hover:text-gaming-black border border-gaming-border text-slate-200`}
                >
                  <span>{channel.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. INTERACTIVE CONTACT FORM & MAP PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gaming-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Glass Form */}
            <div className="lg:col-span-7 rounded-3xl border border-gaming-border bg-gaming-card/50 p-8 backdrop-blur-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-gaming-cyan tracking-widest uppercase">DIRECT MESSAGE</span>
                <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white mt-1">Send Us A Message</h2>
                <p className="text-xs text-slate-400 mt-1">Fill out the form below and our team will get back to you within hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gaming-black border border-gaming-border focus:border-gaming-cyan focus:outline-none text-xs text-slate-200 placeholder-slate-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gaming-black border border-gaming-border focus:border-gaming-cyan focus:outline-none text-xs text-slate-200 placeholder-slate-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gaming-black border border-gaming-border focus:border-gaming-cyan focus:outline-none text-xs text-slate-200 placeholder-slate-500 transition-colors"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Inquiry Category</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gaming-black border border-gaming-border focus:border-gaming-cyan focus:outline-none text-xs text-slate-200 cursor-pointer"
                    >
                      {inquiryTypes.map((t) => (
                        <option key={t.id} value={t.id} className="bg-gaming-dark">{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gaming-black border border-gaming-border focus:border-gaming-cyan focus:outline-none text-xs text-slate-200 placeholder-slate-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Message *</label>
                  <textarea
                    rows={4}
                    placeholder="How can we assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gaming-black border border-gaming-border focus:border-gaming-cyan focus:outline-none text-xs text-slate-200 placeholder-slate-500 transition-colors"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-gaming-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Information & Hub Locations */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-gaming-cyan tracking-widest uppercase">GAMEHUB HUBS</span>
                <h2 className="font-gaming text-2xl font-extrabold text-white mt-1">Visit Experience Centers</h2>
                <p className="text-xs text-slate-400 mt-1">Test consoles live or pick up your rentals in person.</p>
              </div>

              <div className="space-y-4">
                {officeLocations.map((loc, idx) => (
                  <div key={idx} className="glass-card rounded-2xl border border-gaming-border bg-gaming-card/40 p-5 space-y-3 hover:border-gaming-cyan/40 transition-all">
                    <div className="flex items-start justify-between">
                      <h3 className="font-gaming text-sm font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gaming-cyan shrink-0" /> {loc.city}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{loc.address}</p>

                    <div className="pt-2 border-t border-gaming-border/40 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <PhoneCall className="w-3 h-3 text-gaming-cyan" /> {loc.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gaming-cyan" /> {loc.hours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discord Join Callout Card */}
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-gaming-dark p-6 space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-gaming text-base font-bold text-white">GameHub Discord Lounge</h4>
                    <p className="text-xs text-slate-300">Join 50,000+ active gamers & tech enthusiasts</p>
                  </div>
                </div>

                <button 
                  onClick={() => window.open('https://discord.gg/gamehub', '_blank')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                >
                  <Share2 className="w-4 h-4" /> Join Discord Server
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. CONTACT FAQS ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gaming-border bg-gaming-black/40">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Contact Questions</h2>
            <p className="text-xs text-slate-400">Instant answers regarding support response times and emergency assistance</p>
            <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-3 rounded-full" />
          </div>

          <div className="space-y-3 pt-4">
            {contactFAQs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-gaming-border bg-gaming-card/40 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? -1 : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:text-gaming-cyan transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedFAQ === idx ? 'rotate-180 text-gaming-cyan' : 'text-slate-400'}`} />
                </button>
                {expandedFAQ === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-gaming-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
