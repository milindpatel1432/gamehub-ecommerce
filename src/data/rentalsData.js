export const rentalCategories = [
  { id: 'all', name: 'All Rental Gear', icon: 'Gamepad2' },
  { id: 'consoles', name: 'Gaming Consoles', icon: 'Cpu' },
  { id: 'vr', name: 'VR Headsets', icon: 'Sparkles' },
  { id: 'laptops', name: 'Gaming Laptops', icon: 'HardDrive' },
  { id: 'accessories', name: 'Controllers & Gear', icon: 'Layers' },
  { id: 'games', name: 'AAA Game Discs', icon: 'ShoppingBag' }
];

export const rentalBrands = [
  { id: 'All', name: 'All Brands' },
  { id: 'PlayStation', name: 'Sony PlayStation' },
  { id: 'Xbox', name: 'Microsoft Xbox' },
  { id: 'Nintendo', name: 'Nintendo' },
  { id: 'Meta', name: 'Meta Quest VR' },
  { id: 'ASUS', name: 'ASUS ROG' },
  { id: 'Alienware', name: 'Alienware / Dell' }
];

export const rentalDurations = [
  { days: 3, label: '3 Days (Weekend)', discountPct: 0 },
  { days: 7, label: '7 Days (1 Week)', discountPct: 15 },
  { days: 15, label: '15 Days (Fortnight)', discountPct: 25 },
  { days: 30, label: '30 Days (1 Month)', discountPct: 40 }
];

export const rentalProducts = [
  {
    id: 'rent-ps5-slim',
    name: 'PlayStation 5 Slim Digital Edition (Rental)',
    category: 'Gaming Consoles',
    brand: 'PlayStation',
    condition: 'Mint (Sanitized)',
    perDayPrice: 399,
    weeklyPrice: 2299,
    monthlyPrice: 6999,
    securityDeposit: 5000,
    rating: 4.9,
    reviewCount: 340,
    inStock: true,
    badge: 'POPULAR RENTAL',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    description: 'Experience ultra-high speed loading with an ultra-high speed SSD, deeper immersion with haptic feedback, 3D Audio, and an all-new generation of incredible PlayStation games.',
    includes: ['PS5 Slim Console 1TB', '1x DualSense Wireless Controller', 'HDMI 2.1 Cable & Power Cord', '2 Pre-installed Demo Games'],
    specs: {
      Resolution: '4K Ultra HD at 120Hz',
      Storage: '1TB Custom High Speed NVMe SSD',
      Audio: 'Tempest 3D AudioTech',
      Sanitization: 'UV Sterilized & 100% Fully Tested'
    }
  },
  {
    id: 'rent-xbox-series-x',
    name: 'Xbox Series X 1TB Console + Game Pass (Rental)',
    category: 'Gaming Consoles',
    brand: 'Xbox',
    condition: 'Mint (Sanitized)',
    perDayPrice: 449,
    weeklyPrice: 2499,
    monthlyPrice: 7499,
    securityDeposit: 5500,
    rating: 4.85,
    reviewCount: 210,
    inStock: true,
    badge: 'GAME PASS INCLUDED',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=80',
    description: 'The fastest, most powerful Xbox ever. Includes Xbox Game Pass Ultimate subscription pre-loaded for instant access to 100+ high-quality titles during your rental.',
    includes: ['Xbox Series X Console 1TB', '1x Xbox Wireless Controller (Carbon Black)', 'Ultra High Speed HDMI Cable', 'Xbox Game Pass Ultimate Active Access'],
    specs: {
      Performance: '12 Teraflops Processing Power',
      Target: 'True 4K Gaming up to 120 FPS',
      Storage: '1TB Custom NVMe SSD',
      Sanitization: 'UV Sterilized & Tested'
    }
  },
  {
    id: 'rent-meta-quest-3',
    name: 'Meta Quest 3 512GB VR Headset (Rental)',
    category: 'VR Headsets',
    brand: 'Meta',
    condition: 'Brand New Condition',
    perDayPrice: 599,
    weeklyPrice: 3199,
    monthlyPrice: 9999,
    securityDeposit: 6000,
    rating: 4.95,
    reviewCount: 185,
    inStock: true,
    badge: 'VR TOP PICK',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&auto=format&fit=crop&q=80',
    description: 'Transform your living room into a virtual gaming arena. Mixed reality head-mounted display featuring 4K+ Infinite Display and Snapdragon XR2 Gen 2 performance.',
    includes: ['Meta Quest 3 Headset 512GB', '2x Touch Plus Controllers with Lanyards', 'Silicone Face Cover (Sanitized)', 'Fast Charging Adapter & Cable'],
    specs: {
      Display: '4K+ Infinite Display (2064x2208 per eye)',
      Processor: 'Snapdragon XR2 Gen 2',
      Passthrough: 'Full-Color High Fidelity Mixed Reality',
      Sanitization: 'Medical-Grade Anti-bacterial Cleansed'
    }
  },
  {
    id: 'rent-nintendo-switch-oled',
    name: 'Nintendo Switch OLED Model - Mario Red Edition (Rental)',
    category: 'Gaming Consoles',
    brand: 'Nintendo',
    condition: 'Excellent',
    perDayPrice: 299,
    weeklyPrice: 1599,
    monthlyPrice: 4999,
    securityDeposit: 3500,
    rating: 4.8,
    reviewCount: 420,
    inStock: true,
    badge: 'PORTABLE FAVORITE',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop&q=80',
    description: '7-inch OLED screen with vivid colors and crisp contrast. Enjoy tabletop, handheld, or TV mode gaming anywhere in India with free travel carrying pouch.',
    includes: ['Switch OLED Console Unit', 'Joy-Con (L) and Joy-Con (R)', 'Nintendo Switch Dock with LAN Port', 'Carrying Pouch & 128GB MicroSD'],
    specs: {
      Screen: '7-inch Vibrant OLED Display',
      Storage: '64GB Internal + 128GB MicroSD Expansion',
      Battery: 'Up to 9 Hours Portable Playtime',
      Sanitization: 'UV-C Cleaned'
    }
  },
  {
    id: 'rent-asus-rog-ally',
    name: 'ASUS ROG Ally Z1 Extreme Handheld PC (Rental)',
    category: 'Gaming Laptops',
    brand: 'ASUS',
    condition: 'Mint Condition',
    perDayPrice: 649,
    weeklyPrice: 3499,
    monthlyPrice: 10999,
    securityDeposit: 7500,
    rating: 4.9,
    reviewCount: 140,
    inStock: true,
    badge: 'PC HANDHELD KING',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    description: 'Play all your Steam, Epic, and PC Game Pass games on the go with AMD Ryzen Z1 Extreme processor, 120Hz FHD display, and Windows 11 Home.',
    includes: ['ASUS ROG Ally Handheld Console', '65W USB-C PD Charger', 'ROG Ally Stand', 'Hard Shell Travel Case'],
    specs: {
      APU: 'AMD Ryzen Z1 Extreme (8-core / 16-threads)',
      Display: '7-inch FHD 1080p 120Hz Touch Screen',
      RAM: '16GB LPDDR5 6400MHz',
      Storage: '512GB PCIe 4.0 NVMe SSD'
    }
  },
  {
    id: 'rent-ps-vr2-bundle',
    name: 'PlayStation VR2 Headset + Horizon Call of the Mountain (Rental)',
    category: 'VR Headsets',
    brand: 'PlayStation',
    condition: 'Like New',
    perDayPrice: 499,
    weeklyPrice: 2699,
    monthlyPrice: 8499,
    securityDeposit: 5000,
    rating: 4.88,
    reviewCount: 95,
    inStock: true,
    badge: 'NEXT-GEN VR',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80',
    description: 'Feel true next-gen virtual reality with stunning 4K HDR visuals, groundbreaking headset feedback, and eye tracking powered by your PS5.',
    includes: ['PS VR2 Headset', '2x PS VR2 Sense Controllers', 'Stereo Headphones', 'USB Charging Cable'],
    specs: {
      Visuals: '4K HDR OLED (2000x2040 per eye)',
      RefreshRate: '90Hz, 120Hz',
      Sensors: '6-axis Motion Sensing System & Eye Tracking',
      Sanitization: 'Anti-Bacterial UV Sterilized'
    }
  },
  {
    id: 'rent-alienware-m16',
    name: 'Alienware m16 R2 Gaming Laptop RTX 4080 (Rental)',
    category: 'Gaming Laptops',
    brand: 'Alienware',
    condition: 'Mint Condition',
    perDayPrice: 999,
    weeklyPrice: 5499,
    monthlyPrice: 17999,
    securityDeposit: 12000,
    rating: 4.97,
    reviewCount: 78,
    inStock: true,
    badge: 'ULTIMATE PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    description: 'Dominate esports tournaments and AAA games at maximum graphics. Powered by Intel Core i9 14th Gen, NVIDIA GeForce RTX 4080 16GB VRAM, and 240Hz QHD+ display.',
    includes: ['Alienware m16 R2 Laptop', '330W Power Adapter', 'Alienware Gaming Mouse', 'Reinforced Laptop Backpack'],
    specs: {
      CPU: 'Intel Core i9-14900HX',
      GPU: 'NVIDIA GeForce RTX 4080 16GB GDDR6',
      Display: '16.0" QHD+ (2560 x 1600) 240Hz 3ms',
      RAM: '32GB DDR5 5600MHz'
    }
  },
  {
    id: 'rent-dualsense-edge',
    name: 'PS5 DualSense Edge Pro Controller (Rental)',
    category: 'Accessories',
    brand: 'PlayStation',
    condition: 'Mint',
    perDayPrice: 149,
    weeklyPrice: 799,
    monthlyPrice: 2499,
    securityDeposit: 2000,
    rating: 4.82,
    reviewCount: 310,
    inStock: true,
    badge: 'PRO CONTROLLER',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
    description: 'Get an edge in gameplay with custom controls, remappable back buttons, customizable triggers, and changeable stick caps.',
    includes: ['DualSense Edge Controller', 'Carrying Case', '2 Standard / 2 High / 2 Low Dome Caps', '2 Half Dome / 2 Lever Back Buttons'],
    specs: {
      Customization: 'Remappable Buttons & Trigger Locks',
      Battery: 'Rechargeable High-Capacity Battery',
      Sanitization: '100% Disinfected'
    }
  }
];

export const rentalBundles = [
  {
    id: 'bundle-weekend-pass',
    title: 'Weekend Gamer Pass',
    subtitle: 'PS5 Slim + 2 DualSense Controllers + 3 AAA Games',
    duration: '3 Days',
    price: 1899,
    originalPrice: 2799,
    deposit: 5000,
    tag: 'BEST FOR PARTIES',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'bundle-vr-metaverse',
    title: 'VR Metaverse Experience Kit',
    subtitle: 'Meta Quest 3 512GB + Elite Strap + Beat Saber Preloaded',
    duration: '7 Days',
    price: 3499,
    originalPrice: 4899,
    deposit: 6000,
    tag: 'HOT DEAL',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'bundle-esports-tourney',
    title: 'Esports Tournament Pack',
    subtitle: 'Alienware RTX 4080 Laptop + 240Hz Monitor + Mechanical Gear',
    duration: '7 Days',
    price: 7999,
    originalPrice: 11999,
    deposit: 15000,
    tag: 'PRO STREAMER',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'
  }
];

export const rentalProcessSteps = [
  {
    step: '01',
    title: 'Choose Gear & Duration',
    description: 'Select your favorite console, VR headset, or gaming laptop and pick your preferred rental tenure (3 to 30 days).'
  },
  {
    step: '02',
    title: 'Quick Digital KYC',
    description: 'Complete seamless 2-minute identity verification and pay security deposit online.'
  },
  {
    step: '03',
    title: 'Free Doorstep Delivery',
    description: 'Receive 100% sanitized, UV-sterilized, tested gaming gear delivered straight to your home with plug & play setup.'
  },
  {
    step: '04',
    title: 'Hassle-Free Return / Extension',
    description: 'Our pickup agent collects the gear at your doorstep, and your refundable deposit is credited back instantly.'
  }
];

export const rentalFAQs = [
  {
    q: 'How does the security deposit refund work?',
    a: 'Once your rental period finishes and our pickup technician inspects the device for major physical damages, your security deposit is instantly credited back to your original payment method or bank account within 2 to 4 business hours.'
  },
  {
    q: 'Are the rental consoles sanitized and tested before delivery?',
    a: 'Yes, absolutely! Every single console, VR headset, controller, and cable undergoes medical-grade UV-C sterilization, deep cleaning, and rigorous 15-point hardware diagnostic checks before dispatch.'
  },
  {
    q: 'Can I extend my rental duration midway?',
    a: 'Yes! You can extend your rental directly from your GameHub User Dashboard before your current plan expires. Extension rates receive discounted weekly/monthly slabs automatically.'
  },
  {
    q: 'What documents are required for digital KYC verification?',
    a: 'A valid Indian Photo ID (Aadhaar Card, Driving License, or Passport) and proof of current delivery address are required. The KYC verification process is 100% digital and takes under 2 minutes.'
  },
  {
    q: 'What happens if a game controller or console accidentally malfunctions?',
    a: 'All GameHub rental gear comes with complimentary Damage Protection Assurance covering regular wear-and-tear and minor technical glitches. If any issue occurs, we provide free express replacement within 24 hours.'
  }
];

export const rentalReviews = [
  {
    name: 'Rohan Sharma',
    city: 'Mumbai',
    rating: 5,
    comment: 'Rented the PS5 Slim for a long weekend with college friends. Delivery was super fast, console was in mint condition, and deposit refund happened within 2 hours of pickup. Recommended!',
    gear: 'PS5 Slim Digital Edition'
  },
  {
    name: 'Ananya Verma',
    city: 'Bengaluru',
    rating: 5,
    comment: 'The Meta Quest 3 VR headset rental was unbelievable! Pre-loaded games worked flawlessly. Saved me 60k rupees since I only wanted to experience VR for a week.',
    gear: 'Meta Quest 3 512GB'
  },
  {
    name: 'Vikramaditya S.',
    city: 'Delhi NCR',
    rating: 5,
    comment: 'Alienware RTX 4080 laptop rental allowed us to host a local esports tournament smoothly. Flawless hardware and super polite support staff.',
    gear: 'Alienware m16 Gaming Laptop'
  }
];
