import Category from '../models/Category.js';

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('Seeding initial categories...');
      await Category.create([
        {
          name: 'Games',
          slug: 'games',
          description: 'Thrilling titles across all gaming systems',
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
          isActive: true
        },
        {
          name: 'Consoles',
          slug: 'consoles',
          description: 'Premium gaming consoles and hardware',
          image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3',
          isActive: true
        }
      ]);
      console.log('Initial categories seeded.');
    }
  } catch (err) {
    console.error('Error seeding categories:', err);
  }
};
