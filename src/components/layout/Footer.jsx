import { ShieldCheck } from 'lucide-react';
import logo from '../../assets/images/logo.webp';

export default function Footer() {
  const footerSections = [
    {
      title: 'Explore',
      links: [
        { name: 'Latest Games', href: '#' },
        { name: 'Consoles', href: '#' },
        { name: 'Rentals', href: '#' },
        { name: 'Elite Pass', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Support Center', href: '#' },
        { name: 'Shipping Info', href: '#' },
        { name: 'Returns & Refunds', href: '#' },
        { name: 'Secure Payments', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact Us', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-gaming-border bg-gaming-black/90 pt-16 pb-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="GameHub Logo" className="h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.2)]" />
            </div>
            <p className="text-[15px] leading-relaxed max-w-sm">
              The definitive destination for next-generation gaming, renting, and elite software experiences.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-gaming-card hover:bg-gaming-accent/20 hover:text-gaming-cyan border border-gaming-border hover:border-gaming-cyan/40 flex items-center justify-center transition-all duration-300">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gaming-card hover:bg-gaming-accent/20 hover:text-gaming-cyan border border-gaming-border hover:border-gaming-cyan/40 flex items-center justify-center transition-all duration-300">
                <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Github" className="w-10 h-10 rounded-full bg-gaming-card hover:bg-gaming-accent/20 hover:text-gaming-cyan border border-gaming-border hover:border-gaming-cyan/40 flex items-center justify-center transition-all duration-300">
                <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
              <a href="#" aria-label="Youtube" className="w-10 h-10 rounded-full bg-gaming-card hover:bg-gaming-accent/20 hover:text-gaming-cyan border border-gaming-border hover:border-gaming-cyan/40 flex items-center justify-center transition-all duration-300">
                <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h4 className="text-white font-gaming text-sm font-semibold tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3.5 text-[15px]">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="hover:text-gaming-cyan transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gaming-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 GameHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gaming-cyan" />
            <span>Secure SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
