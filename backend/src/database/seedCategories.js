import Category from '../models/Category.js';

export const seedCategories = async () => {
  try {
    // Refresh categories catalog
    await Category.deleteMany({});
    console.log('[Database] Cleared old category records.');

    const categoriesData = [
      {
        name: 'Gaming Consoles',
        slug: 'gaming-consoles',
        description: 'Next-gen gaming systems, handhelds, and virtual reality consoles.',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Games',
        slug: 'games',
        description: 'Top-tier AAA blockbusters, indie gems, and digital game downloads.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Gaming Accessories',
        slug: 'gaming-accessories',
        description: 'Pro controllers, surround headsets, mechanical keyboards, and precision mice.',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Gaming Chairs',
        slug: 'gaming-chairs',
        description: 'Ergonomic gaming chairs engineered for maximum comfort during long sessions.',
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Gaming Monitors',
        slug: 'gaming-monitors',
        description: 'Ultra-fast OLED and IPS high-refresh rate 4K & QHD gaming displays.',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Graphics Cards',
        slug: 'graphics-cards',
        description: 'High-performance NVIDIA GeForce RTX & AMD Radeon GPUs for ray tracing.',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Processors',
        slug: 'processors',
        description: 'Intel Core & AMD Ryzen multi-core desktop CPUs for intense gaming & streaming.',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'RAM',
        slug: 'ram',
        description: 'High-speed DDR5 & DDR4 RGB desktop gaming memory modules.',
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'SSD',
        slug: 'ssd',
        description: 'Ultra-fast PCIe Gen4 & Gen5 NVMe M.2 solid-state drives for games and consoles.',
        image: 'https://images.unsplash.com/photo-1597872250970-45600a12e8b0?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Cabinets',
        slug: 'cabinets',
        description: 'Premium PC cases, dual-chamber glass cabinets, and airflow mesh towers.',
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Power Supplies',
        slug: 'power-supplies',
        description: '80 Plus Gold & Platinum modular ATX 3.0 power supplies for gaming rigs.',
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Streaming Equipment',
        slug: 'streaming-equipment',
        description: 'Stream decks, studio condenser microphones, 4K webcams, and capture cards.',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
    ];

    await Category.insertMany(categoriesData);
    console.log('[Database] 12 GameHub Categories seeded successfully.');
  } catch (err) {
    console.error('Error seeding categories:', err);
  }
};
