export const dealCategories = [
  { id: 'all', name: 'All Hot Deals', icon: 'Flame' },
  { id: 'flash', name: 'Flash Sales', icon: 'Zap' },
  { id: 'consoles', name: 'Console Savings', icon: 'Cpu' },
  { id: 'accessories', name: 'Gear & Controllers', icon: 'Layers' },
  { id: 'games', name: 'AAA Game Price Drops', icon: 'Gamepad2' }
];

export const discountTiers = [
  { id: 'all', label: 'All Discounts', minPct: 0 },
  { id: '15plus', label: '15%+ OFF', minPct: 15 },
  { id: '25plus', label: '25%+ OFF', minPct: 25 },
  { id: '40plus', label: '40%+ OFF', minPct: 40 },
  { id: '50plus', label: '50%+ OFF', minPct: 50 }
];

export const activeCoupons = [
  {
    code: 'GAMEHUB10',
    discountText: '10% EXTRA OFF',
    minSpend: 1999,
    description: 'Applicable on all AAA Game titles & Accessories',
    expiry: 'Ends Sunday midnight',
    bgGradient: 'from-cyan-500/20 via-blue-600/10 to-transparent'
  },
  {
    code: 'FLASH20',
    discountText: 'FLAT ₹2,000 OFF',
    minSpend: 29999,
    description: 'Instant discount on all PS5 & Xbox Console Bundles',
    expiry: 'Only 14 Redemptions Left',
    bgGradient: 'from-purple-500/20 via-pink-600/10 to-transparent'
  },
  {
    code: 'RENTALPRO',
    discountText: '20% OFF RENTALS',
    minSpend: 1499,
    description: 'Valid on weekly & monthly console rentals',
    expiry: 'Limited Time Deal',
    bgGradient: 'from-emerald-500/20 via-teal-600/10 to-transparent'
  }
];

export const dealProducts = [
  {
    id: 'deal-ps5-spider-man-bundle',
    name: 'PlayStation 5 Slim Marvel\'s Spider-Man 2 Limited Bundle',
    category: 'Console Savings',
    brand: 'PlayStation',
    originalPrice: 54990,
    discountedPrice: 44990,
    savingsPct: 18,
    rating: 4.95,
    reviewCount: 520,
    inStock: true,
    stockLeft: 3,
    totalStock: 25,
    badge: 'FLASH DEAL',
    flashEndTime: '04:32:15',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    description: 'Limited edition PS5 console featuring custom Symbiote takeover design, voucher for Marvel\'s Spider-Man 2 Full Game, and DualSense Wireless Controller.',
    specs: {
      Edition: 'Marvel\'s Spider-Man 2 Limited Edition',
      Storage: '1TB Ultra High Speed NVMe SSD',
      Included: 'Full Game Digital Voucher + Limited DualSense',
      Warranty: '1 Year Official Sony India Warranty'
    }
  },
  {
    id: 'deal-xbox-series-s-starter',
    name: 'Xbox Series S 512GB Starter Bundle + 3 Months Game Pass',
    category: 'Console Savings',
    brand: 'Xbox',
    originalPrice: 34990,
    discountedPrice: 24999,
    savingsPct: 29,
    rating: 4.8,
    reviewCount: 380,
    inStock: true,
    stockLeft: 5,
    totalStock: 30,
    badge: 'MEGA PRICE DROP',
    flashEndTime: '06:15:40',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=80',
    description: 'Next-gen speed and performance at an accessible price point. Includes 3 Months of Xbox Game Pass Ultimate giving access to Starfield, Forza, and 100+ titles.',
    specs: {
      Resolution: 'Up to 120 FPS at 1440p',
      Storage: '512GB Custom NVMe SSD',
      Bonus: '3 Months Game Pass Ultimate Preloaded',
      Warranty: '1 Year Official Microsoft Warranty'
    }
  },
  {
    id: 'deal-meta-quest-2-256gb',
    name: 'Meta Quest 2 256GB Advanced All-In-One VR Headset',
    category: 'Flash Sales',
    brand: 'Meta',
    originalPrice: 39999,
    discountedPrice: 23999,
    savingsPct: 40,
    rating: 4.88,
    reviewCount: 640,
    inStock: true,
    stockLeft: 2,
    totalStock: 20,
    badge: 'CLEARANCE 40% OFF',
    flashEndTime: '02:45:10',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&auto=format&fit=crop&q=80',
    description: 'Blazing-fast processor and high-resolution display. Enjoy immersive VR gaming, fitness, and entertainment without wires or PC connection.',
    specs: {
      Display: '1832 x 1920 pixels per eye',
      Storage: '256GB Built-In Memory',
      Audio: '3D Positional Audio Integrated',
      Included: '2x Touch Controllers & Glasses Spacer'
    }
  },
  {
    id: 'deal-dualsense-cosmic-red',
    name: 'PS5 DualSense Wireless Controller - Cosmic Red Edition',
    category: 'Gear & Controllers',
    brand: 'PlayStation',
    originalPrice: 6390,
    discountedPrice: 4299,
    savingsPct: 33,
    rating: 4.9,
    reviewCount: 890,
    inStock: true,
    stockLeft: 8,
    totalStock: 50,
    badge: 'TOP SELLER',
    flashEndTime: '08:20:00',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
    description: 'Discover a deeper, highly immersive gaming experience with innovative new PS5 controller featuring haptic feedback and dynamic trigger effects.',
    specs: {
      Color: 'Cosmic Red',
      Haptics: 'Dual Actuators Feedback',
      BuiltIn: 'Microphone & 3.5mm Headset Jack',
      Connector: 'USB Type-C Fast Charge'
    }
  },
  {
    id: 'deal-gta5-ps5',
    name: 'Grand Theft Auto V: Expanded & Enhanced (PlayStation 5)',
    category: 'AAA Game Price Drops',
    brand: 'PlayStation',
    originalPrice: 2799,
    discountedPrice: 1299,
    savingsPct: 54,
    rating: 4.92,
    reviewCount: 1420,
    inStock: true,
    stockLeft: 12,
    totalStock: 100,
    badge: '54% PRICE CUT',
    flashEndTime: '11:00:00',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    description: 'Experience blockbuster hits Grand Theft Auto V and GTA Online, now upgraded for PS5 with stunning 4K visuals, ray tracing, and faster load times.',
    specs: {
      Platform: 'PlayStation 5 Disc',
      Mode: 'Single Player & GTA Online',
      Visuals: '4K 60FPS Fidelity & Performance Modes',
      Audio: '3D Tempest Audio Support'
    }
  },
  {
    id: 'deal-rog-ally-z1-extreme',
    name: 'ASUS ROG Ally Z1 Extreme Handheld Gaming PC (Price Drop)',
    category: 'Console Savings',
    brand: 'ASUS',
    originalPrice: 69990,
    discountedPrice: 53990,
    savingsPct: 23,
    rating: 4.85,
    reviewCount: 310,
    inStock: true,
    stockLeft: 4,
    totalStock: 15,
    badge: 'FLAT ₹16,000 OFF',
    flashEndTime: '05:50:30',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    description: 'Play any PC game anywhere with AMD Ryzen Z1 Extreme processor, 120Hz FHD touch display, and Windows 11 Home.',
    specs: {
      Processor: 'AMD Ryzen Z1 Extreme',
      Display: '7" FHD 1080p 120Hz Touch Screen',
      RAM: '16GB LPDDR5',
      Storage: '512GB PCIe 4.0 NVMe SSD'
    }
  },
  {
    id: 'deal-steelseries-arctis-nova',
    name: 'SteelSeries Arctis Nova 7X Wireless Multi-System Gaming Headset',
    category: 'Gear & Controllers',
    brand: 'SteelSeries',
    originalPrice: 19999,
    discountedPrice: 13999,
    savingsPct: 30,
    rating: 4.87,
    reviewCount: 230,
    inStock: true,
    stockLeft: 6,
    totalStock: 25,
    badge: 'AUDIO DEAL',
    flashEndTime: '07:10:15',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    description: 'Almighty Audio for Xbox, PC, PS5, Switch, and Mobile with 38-hour battery life and simultaneous 2.4GHz & Bluetooth audio.',
    specs: {
      Connectivity: '2.4GHz Wireless + Bluetooth 5.0',
      Battery: '38 Hours Playtime + Fast Charge',
      Mic: 'ClearCast Gen 2 Noise Cancelling',
      Platform: 'Multi-System Compatible'
    }
  },
  {
    id: 'deal-spider-man-2-game',
    name: 'Marvel\'s Spider-Man 2 - PlayStation 5 Standard Edition',
    category: 'AAA Game Price Drops',
    brand: 'PlayStation',
    originalPrice: 4999,
    discountedPrice: 2999,
    savingsPct: 40,
    rating: 4.98,
    reviewCount: 1850,
    inStock: true,
    stockLeft: 15,
    totalStock: 80,
    badge: 'GOTY NOMINEE 40% OFF',
    flashEndTime: '09:40:00',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&auto=format&fit=crop&q=80',
    description: 'Peter Parker and Miles Morales return for an exciting new adventure in the critically acclaimed Marvel\'s Spider-Man franchise for PS5.',
    specs: {
      Platform: 'PlayStation 5 Disc',
      Genre: 'Action Adventure',
      Publisher: 'Sony Interactive Entertainment',
      Language: 'English Audio & Subtitles'
    }
  }
];

export const dealFAQs = [
  {
    q: 'How long do Flash Sale prices remain valid?',
    a: 'Flash Sale discounts are limited-time price drops valid only until the live timer runs out or available promotional stock is completely claimed.'
  },
  {
    q: 'Can I combine promo coupon codes with existing deals?',
    a: 'Yes! Additional coupon vouchers (like GAMEHUB10 or FLASH20) can be applied at checkout on top of existing discounted prices for maximum savings.'
  },
  {
    q: 'Are items on sale genuine and covered by brand warranty?',
    a: '100% Yes! All consoles, accessories, and games sold on GameHub Deals are brand new, original factory-sealed units covered by official manufacturer warranties.'
  },
  {
    q: 'What if a deal item goes out of stock?',
    a: 'Items marked with limited stock badges are reserved on a first-come, first-served basis once added to cart and successfully checked out.'
  }
];
