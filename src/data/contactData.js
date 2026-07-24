export const supportChannels = [
  {
    id: 'live-chat',
    title: 'Instant 24/7 Live Chat',
    description: 'Connect with a GameHub support agent in under 60 seconds.',
    actionText: 'Start Live Chat',
    icon: 'MessageSquare',
    color: 'from-cyan-500/20 to-blue-600/10',
    borderColor: 'border-gaming-cyan/40',
    textColor: 'text-gaming-cyan',
    badge: 'ONLINE NOW'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Gamer Helpline',
    description: 'Quick resolution for order tracking, rentals, and payments.',
    actionText: 'Chat on WhatsApp',
    icon: 'PhoneCall',
    color: 'from-emerald-500/20 to-teal-600/10',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    badge: 'FAST RESPONSE'
  },
  {
    id: 'discord',
    title: 'Discord Community Lounge',
    description: 'Join 50,000+ gamers, ask tech questions, and get instant help.',
    actionText: 'Join Discord Server',
    icon: 'Share2',
    color: 'from-indigo-500/20 to-purple-600/10',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-400',
    badge: '50K+ MEMBERS'
  },
  {
    id: 'email',
    title: 'Official Email Support',
    description: 'Send detailed inquiries, business partnerships, or feedback.',
    actionText: 'support@gamehub.com',
    icon: 'Mail',
    color: 'from-purple-500/20 to-pink-600/10',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    badge: '24-HOUR SLA'
  }
];

export const inquiryTypes = [
  { id: 'general', label: 'General Inquiry / Question' },
  { id: 'rental', label: 'Console & Gear Rental Support' },
  { id: 'order', label: 'Order Tracking & Delivery Status' },
  { id: 'tech', label: 'Hardware Technical Assistance / Repair' },
  { id: 'business', label: 'Wholesale, Bulk & Business Partnerships' }
];

export const officeLocations = [
  {
    city: 'Mumbai (Flagship Experience Center)',
    address: 'Level 4, High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    phone: '+91 (022) 8899-7766',
    email: 'mumbai.hub@gamehub.com',
    hours: 'Mon - Sun: 10:00 AM - 10:00 PM',
    mapImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80'
  },
  {
    city: 'Bengaluru (Tech & Innovation Hub)',
    address: '7th Floor, Prestige Tech Park, Outer Ring Road, Marathahalli, Bengaluru, Karnataka 560103',
    phone: '+91 (080) 4455-6677',
    email: 'bengaluru.hub@gamehub.com',
    hours: 'Mon - Sat: 9:30 AM - 9:00 PM',
    mapImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80'
  },
  {
    city: 'Delhi NCR (Fulfillment Center)',
    address: 'DLF Cyber City, Building 10, Sector 24, Gurugram, Haryana 122002',
    phone: '+91 (0124) 3322-1100',
    email: 'delhi.hub@gamehub.com',
    hours: 'Mon - Sat: 10:00 AM - 8:30 PM',
    mapImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'
  }
];

export const contactFAQs = [
  {
    q: 'What is the average response time for support messages?',
    a: 'Live Chat and WhatsApp messages are answered in under 60 seconds during operational hours. Email inquiries are responded to within 2 to 4 business hours.'
  },
  {
    q: 'How can I get emergency assistance for my active console rental?',
    a: 'For active rental support (malfunctions, extension requests, or pickup changes), please contact our dedicated 24/7 Rental Hotline at +91 98765 43210 or use the Live Chat option selecting "Rental Support".'
  },
  {
    q: 'Can I visit the GameHub Experience Centers in person?',
    a: 'Yes! You are welcome to visit our Flagship Experience Centers in Mumbai, Bengaluru, and Delhi NCR to test high-end gaming setups, pick up rental consoles, or get hardware assistance.'
  },
  {
    q: 'How do I submit an emergency order cancellation request?',
    a: 'Order cancellation can be requested directly from your User Dashboard -> Orders page if the package has not yet been dispatched. Alternatively, notify our Live Support immediately.'
  }
];
