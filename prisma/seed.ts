import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../app/utils/auth'; 

const prisma = new PrismaClient();

async function main() {
  const categories = [
    'Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Toys & Games',
    'Health & Personal Care', 'Beauty', 'Sports & Outdoors', 'Automotive',
    'Grocery & Gourmet', 'Office Supplies', 'Pet Supplies', 'Music & Instruments',
    'Garden & Outdoor', 'Tools & Hardware', 'Mobile Accessories', 'Baby Products',
    'Jewelry & Watches', 'Footwear', 'Stationery & Art',
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const sellerEmail = 'seller@example.com';
  const sellerPassword = await hashPassword('password123');

  const sellerUser = await prisma.user.upsert({
    where: { email: sellerEmail },
    update: {},
    create: {
      email: sellerEmail,
      password: sellerPassword,
      role: 'SELLER',
      isVerified: true,
      sellerProfile: {
        create: {
          shopName: 'Seed Seller Shop',
          gstNumber: '22ABCDE1234FZ1Z',
        },
      },
    },
    include: { sellerProfile: true },
  });

  const buyers = [
    { email: 'buyer1@example.com', password: 'password123' },
    { email: 'buyer2@example.com', password: 'password123' },
  ];

  for (const b of buyers) {
    const hashed = await hashPassword(b.password);
    await prisma.user.upsert({
      where: { email: b.email },
      update: {},
      create: {
        email: b.email,
        password: hashed,
        role: 'BUYER',
        isVerified: true,
        buyerProfile: { create: {} },
      },
    });
  }

  const allCategories = await prisma.category.findMany();

  for (let i = 1; i <= 10; i++) {
    await prisma.product.create({
      data: {
        name: `Seed Product ${i}`,
        description: `This is the description for seed product ${i}`,
        price: Math.floor(Math.random() * 1000) + 100,
        stock: 10 + i,
        tags: ['seeded', 'demo'],
        sellerProfileId: sellerUser.sellerProfile!.id,
        categoryId: allCategories[i % allCategories.length].id,
      },
    });
  }
   const productSeeds = [
        {
            name: 'UltraPhone X',
            description: 'Latest 5G smartphone with high-end specs',
            tags: ['electronics', 'smartphone'],
        },
        {
            name: 'UltraPhone Case',
            description: 'Protective case for UltraPhone X',
            tags: ['accessory', 'phone'],
        },
        {
            name: 'Noise Cancelling Headphones',
            description: '',
            tags: ['audio', 'headphones'],
        },
        {
            name: 'Gaming Mouse Pro',
            description: 'High DPI gaming mouse for professionals',
            tags: ['gaming', 'mouse'],
        },
        {
            name: 'Seed Hoodie XL',
            description: 'Premium quality oversized hoodie',
            tags: ['fashion', 'clothing'],
        },
        {
            name: 'Seed Hoodie S',
            description: 'Same hoodie, smaller size',
            tags: ['fashion'],
        },
        {
            name: 'CookMaster Non-Stick Pan',
            description: 'Durable non-stick pan for daily cooking',
            tags: ['kitchen', 'cookware'],
        },
        {
            name: 'JavaScript for Pros',
            description: 'Advanced programming book for JS developers',
            tags: ['books', 'programming'],
        },
        {
            name: 'Minimalist Desk Lamp',
            description: 'LED desk lamp with USB port',
            tags: ['home', 'lighting'],
        },
        {
            name: 'Water Bottle 1L',
            description: '',
            tags: [], 
        },
    ];

    for (let i = 0; i < productSeeds.length; i++) {
        const seed = productSeeds[i];
        await prisma.product.create({
            data: {
            name: seed.name,
            description: seed.description,
            price: Math.floor(Math.random() * 1000) + 100,
            stock: 10 + i,
            tags: seed.tags,
            sellerProfileId: sellerUser.sellerProfile!.id,
            categoryId: allCategories[i % allCategories.length].id,
            },
        });
    }

}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
