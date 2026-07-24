import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Sparkles, MapPin, Clock, ArrowRight, CheckCircle2, Zap, Users, X, Send } from 'lucide-react';
import { successToast } from '../../utils/toast';

const OPEN_ROLES = [
  {
    id: 'fullstack-dev',
    title: 'Senior Full Stack Gaming Engineer',
    department: 'Engineering & Tech',
    location: 'Bengaluru / Remote',
    type: 'Full-Time',
    experience: '3+ Years',
    salary: '₹18L - ₹28L / yr',
    description: 'Build high-throughput marketplace APIs, rental scheduling engines, and real-time inventory systems for 500,000+ gamers.'
  },
  {
    id: 'hardware-tech',
    title: 'Console Hardware Technician',
    department: 'Operations & Testing',
    location: 'Mumbai / Delhi NCR',
    type: 'Full-Time',
    experience: '2+ Years',
    salary: '₹6L - ₹10L / yr',
    description: 'Inspect, UV-sterilize, repair, and benchmark next-gen PlayStation 5, Xbox, and VR headset rental inventory.'
  },
  {
    id: 'esports-lead',
    title: 'Esports Community & Event Lead',
    department: 'Marketing & Community',
    location: 'Mumbai (Flagship Hub)',
    type: 'Full-Time',
    experience: '2+ Years',
    salary: '₹10L - ₹16L / yr',
    description: 'Host weekly AAA gaming tournaments, build brand partnerships with game studios, and scale the GameHub Discord community.'
  },
  {
    id: 'growth-specialist',
    title: 'Growth & Performance Marketing Specialist',
    department: 'Growth',
    location: 'Remote',
    type: 'Full-Time',
    experience: '3+ Years',
    salary: '₹12L - ₹20L / yr',
    description: 'Drive user acquisition for console rentals and game sales across Meta, Google, Twitch, and gaming influencer networks.'
  }
];

export default function Careers() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      successToast(`Application submitted for ${selectedRole.title}! Our talent team will contact you.`);
      setSelectedRole(null);
      setApplicantName('');
      setApplicantEmail('');
      setResumeUrl('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-slate-100 pb-20 overflow-hidden font-sans">
      
      {/* Hero Header */}
      <section className="relative w-full py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-gaming-border overflow-hidden bg-gradient-to-b from-gaming-black via-gaming-dark to-gaming-dark">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-gaming-cyan/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-4xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/30 text-gaming-cyan text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Briefcase className="w-3.5 h-3.5 text-gaming-cyan" /> Join The GameHub Team
          </div>

          <h1 className="font-gaming text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Build The Future Of <br />
            <span className="bg-gradient-to-r from-gaming-cyan via-blue-400 to-gaming-accent bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Gaming In India
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We are building India's premier AAA gaming marketplace & console rental platform. Join an elite crew of engineers, gamers, and operational visionaries.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-2xl mx-auto border-t border-gaming-border/60">
            <div>
              <p className="text-xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-400">Gamer First Culture</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gaming-cyan">Free</p>
              <p className="text-xs text-slate-400">Console & Game Pass</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Hybrid</p>
              <p className="text-xs text-slate-400">Flexible Remote Work</p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">Competitive</p>
              <p className="text-xs text-slate-400">Equity & ESOPs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-gaming-cyan tracking-widest uppercase">OPEN POSITIONS</span>
          <h2 className="font-gaming text-3xl font-extrabold text-white">Current Opportunities</h2>
          <div className="h-1 w-16 bg-gaming-cyan mx-auto mt-2 rounded-full" />
        </div>

        <div className="space-y-4">
          {OPEN_ROLES.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.01 }}
              className="glass-card rounded-2xl border border-gaming-border bg-gaming-card/50 p-6 hover:border-gaming-cyan/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-gaming-cyan/15 text-gaming-cyan border border-gaming-cyan/30">
                    {role.department}
                  </span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {role.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {role.type}</span>
                </div>
                <h3 className="font-gaming text-lg font-bold text-white">{role.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{role.description}</p>
                <span className="text-xs font-bold text-emerald-400 block pt-1">{role.salary}</span>
              </div>

              <button
                onClick={() => setSelectedRole(role)}
                className="h-11 px-6 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gaming-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-gaming-card border border-gaming-cyan/30 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gaming-black/60 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-xs font-bold text-gaming-cyan uppercase">{selectedRole.department}</span>
                <h3 className="font-gaming text-xl font-extrabold text-white mt-1">Apply for {selectedRole.title}</h3>
                <p className="text-xs text-slate-400">{selectedRole.location} • {selectedRole.salary}</p>
              </div>

              <form onSubmit={handleApply} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gaming-black border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gaming-black border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">LinkedIn / Portfolio / Resume Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gaming-black border border-gaming-border text-xs text-slate-200 focus:outline-none focus:border-gaming-cyan"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gaming-cyan text-gaming-black font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-gaming-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Application
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
