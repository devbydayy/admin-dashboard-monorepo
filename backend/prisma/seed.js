const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { generateOrderNumber } = require('../src/utils/helpers');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[rand(0, arr.length - 1)];
const TODAY = new Date('2026-05-12');

const daysAgo = (days) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  d.setHours(rand(8, 22), rand(0, 59), rand(0, 59), 0);
  return d;
};

async function main() {
  console.log('🌱 Seeding large dataset...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  const demoUsers = [
    { email: 'manager@example.com', name: 'Sarah Manager', password: await bcrypt.hash('password123', 10), role: 'MANAGER' },
    { email: 'support@example.com', name: 'Mike Support', password: await bcrypt.hash('password123', 10), role: 'SUPPORT' },
    { email: 'staff@example.com', name: 'John Staff', password: await bcrypt.hash('password123', 10), role: 'USER' },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // Product Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics', type: 'Product' },
  });
  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: { name: 'Clothing', slug: 'clothing', type: 'Product' },
  });
  const books = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: { name: 'Books', slug: 'books', type: 'Product' },
  });
  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: { name: 'Sports', slug: 'sports', type: 'Product' },
  });
  const office = await prisma.category.upsert({
    where: { slug: 'office' },
    update: {},
    create: { name: 'Office', slug: 'office', type: 'Product' },
  });
  const home = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: { name: 'Home & Garden', slug: 'home-garden', type: 'Product' },
  });
  const toys = await prisma.category.upsert({
    where: { slug: 'toys' },
    update: {},
    create: { name: 'Toys', slug: 'toys', type: 'Product' },
  });
  const automotive = await prisma.category.upsert({
    where: { slug: 'automotive' },
    update: {},
    create: { name: 'Automotive', slug: 'automotive', type: 'Product' },
  });
  const health = await prisma.category.upsert({
  where: { slug: 'health-wellness' },
  update: {},
  create: {
    name: 'Health & Wellness', slug: 'health-wellness', type: 'Product'},
  });

  // Blog Categories
  const technology = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: { name: 'Technology', slug: 'technology', type: 'Blog' },
  });
  const lifestyle = await prisma.category.upsert({
    where: { slug: 'lifestyle' },
    update: {},
    create: { name: 'Lifestyle', slug: 'lifestyle', type: 'Blog' },
  });
  const travel = await prisma.category.upsert({
    where: { slug: 'travel' },
    update: {},
    create: { name: 'Travel', slug: 'travel', type: 'Blog' },
  });

  const products = [];

  const productData = [
  // Electronics
  { id: 'prod-1', name: 'Wireless Headphones', price: 89.99, stock: 245, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/wireless-headphones.jpg' },
  { id: 'prod-2', name: 'Smart Watch Series 8', price: 329.99, stock: 5, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/smart-watch-series-8.jpg' },
  { id: 'prod-3', name: 'Gaming Keyboard', price: 119.99, stock: 621, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/gaming-keyboard.jpg' },
  { id: 'prod-4', name: '4K Action Camera', price: 199.99, stock: 0, status: 'OUT_OF_STOCK', categoryId: electronics.id, imageUrl: '/images/products/4k-action-camera.jpg' },
  { id: 'prod-13', name: 'Bluetooth Speaker', price: 59.99, stock: 120, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/bluetooth-speaker.jpg' },
  { id: 'prod-15', name: 'Desk Lamp', price: 39.99, stock: 95, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/desk-lamp.jpg' },
  { id: 'prod-18', name: 'Monitor Arm', price: 79.99, stock: 110, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/monitor-arm.jpg' },
  { id: 'prod-19', name: 'Webcam HD', price: 69.99, stock: 75, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/webcam-hd.jpg' },
  { id: 'prod-20', name: 'USB-C Hub', price: 49.99, stock: 160, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/usb-c-hub.jpg' },
  { id: 'prod-21', name: 'External SSD 1TB', price: 159.99, stock: 60, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/external-ssd-1tb.jpg' },
  { id: 'prod-22', name: 'Wireless Mouse', price: 29.99, stock: 220, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/wireless-mouse.jpg' },
  { id: 'prod-23', name: 'Ergonomic Keyboard', price: 99.99, stock: 70, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/ergonomic-keyboard.jpg' },
  { id: 'prod-24', name: 'Noise-Cancelling Earbuds', price: 129.99, stock: 55, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/noise-cancelling-earbuds.jpg' },
  { id: 'prod-25', name: 'Smart Light Bulb', price: 19.99, stock: 300, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/smart-light-bulb.jpg' },
  { id: 'prod-28', name: 'Air Purifier', price: 149.99, stock: 40, status: 'ACTIVE', categoryId: electronics.id, imageUrl: '/images/products/air-purifier.jpg' },

  // Clothing
  { id: 'prod-5', name: 'Laptop Backpack', price: 49.99, stock: 87, status: 'ACTIVE', categoryId: clothing.id, imageUrl: '/images/products/laptop-backpack.jpg' },
  { id: 'prod-6', name: 'Running Shoes', price: 79.99, stock: 120, status: 'ACTIVE', categoryId: clothing.id, imageUrl: '/images/products/running-shoes.jpg' },
  { id: 'prod-7', name: 'Winter Jacket', price: 149.99, stock: 30, status: 'ACTIVE', categoryId: clothing.id, imageUrl: '/images/products/winter-jacket.jpg' },
  { id: 'prod-36', name: 'Hiking Boots', price: 129.99, stock: 35, status: 'ACTIVE', categoryId: clothing.id, imageUrl: '/images/products/hiking-boots.jpg' },

  // Books
  { id: 'prod-8', name: 'E-Book Reader', price: 109.99, stock: 18, status: 'ACTIVE', categoryId: books.id, imageUrl: '/images/products/e-book-reader.jpg' },
  { id: 'prod-9', name: 'JavaScript Cookbook', price: 34.99, stock: 300, status: 'ACTIVE', categoryId: books.id, imageUrl: '/images/products/javascript-cookbook.jpg' },
  { id: 'prod-14', name: 'Mechanical Pencil Set', price: 14.99, stock: 210, status: 'ACTIVE', categoryId: books.id, imageUrl: '/images/products/mechanical-pencil-set.jpg' },

  // Sports
  { id: 'prod-10', name: 'Yoga Mat', price: 24.99, stock: 150, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/yoga-mat.jpg' },
  { id: 'prod-11', name: 'Basketball', price: 29.99, stock: 45, status: 'INACTIVE', categoryId: sports.id, imageUrl: '/images/products/basketball.jpg' },
  { id: 'prod-12', name: 'Resistance Bands', price: 19.99, stock: 500, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/resistance-bands.jpg' },
  { id: 'prod-26', name: 'Fitness Tracker', price: 89.99, stock: 130, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/fitness-tracker.jpg' },
  { id: 'prod-33', name: 'Tent 4-Person', price: 199.99, stock: 20, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/tent-4-person.jpg' },
  { id: 'prod-34', name: 'Sleeping Bag', price: 89.99, stock: 50, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/sleeping-bag.jpg' },
  { id: 'prod-35', name: 'Camping Stove', price: 59.99, stock: 45, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/camping-stove.jpg' },
  { id: 'prod-43', name: 'Yoga Block', price: 14.99, stock: 210, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/yoga-block.jpg' },
  { id: 'prod-44', name: 'Resistance Loop', price: 12.99, stock: 260, status: 'ACTIVE', categoryId: sports.id, imageUrl: '/images/products/resistance-loop.jpg' },

  // Office
  { id: 'prod-16', name: 'Office Chair', price: 189.99, stock: 40, status: 'ACTIVE', categoryId: office.id, imageUrl: '/images/products/office-chair.jpg' },
  { id: 'prod-17', name: 'Standing Desk', price: 299.99, stock: 25, status: 'ACTIVE', categoryId: office.id, imageUrl: '/images/products/standing-desk.jpg' },

  // Home & Garden
  { id: 'prod-41', name: 'Humidifier', price: 49.99, stock: 85, status: 'ACTIVE', categoryId: home.id, imageUrl: '/images/products/humidifier.jpg' },
  { id: 'prod-42',name: 'Vacuum Cleaner', price: 129.99, stock: 85, status: 'ACTIVE', categoryId: home.id, imageUrl: '/images/products/vacuum-cleaner.jpg' },
  { id: 'prod-54', name: 'Electric Kettle', price: 39.99, stock: 85, status: 'ACTIVE', categoryId: home.id, imageUrl: '/images/products/electric-kettle.jpg' },
  { id: 'prod-29', name: 'Coffee Maker', price: 79.99, stock: 90, status: 'ACTIVE', categoryId: home.id, imageUrl: '/images/products/coffee-maker.jpg' },
  { id: 'prod-30', name: 'Toaster', price: 34.99, stock: 140, status: 'ACTIVE', categoryId: home.id, imageUrl: '/images/products/toaster.jpg' },
  { id: 'prod-31', name: 'Blender', price: 69.99, stock: 75, status: 'ACTIVE', categoryId: home.id, imageUrl: '/images/products/blender.jpg' },
  { id: 'prod-32', name: 'Rice Cooker', price: 54.99, stock: 95, status: 'ACTIVE', categoryId: home.id, imageUrl: '/images/products/rice-cooker.jpg' },

  // Toys
  { id: 'prod-37', name: 'Board Game Set', price: 39.99, stock: 120, status: 'ACTIVE', categoryId: toys.id, imageUrl: '/images/products/board-game-set.jpg' },
  { id: 'prod-38', name: 'Puzzle 1000pc', price: 24.99, stock: 200, status: 'ACTIVE', categoryId: toys.id, imageUrl: '/images/products/puzzle-1000pc.jpg' },
  { id: 'prod-39', name: 'Action Figure', price: 29.99, stock: 150, status: 'ACTIVE', categoryId: toys.id, imageUrl: '/images/products/action-figure.jpg' },
  { id: 'prod-40', name: 'Doll House', price: 89.99, stock: 60, status: 'ACTIVE', categoryId: toys.id, imageUrl: '/images/products/doll-house.jpg' },

  // Automotive
  { id: 'prod-45', name: 'Car Phone Mount', price: 16.99, stock: 175, status: 'ACTIVE', categoryId: automotive.id, imageUrl: '/images/products/car-phone-mount.jpg' },
  { id: 'prod-46', name: 'Dash Cam', price: 119.99, stock: 65, status: 'ACTIVE', categoryId: automotive.id, imageUrl: '/images/products/dash-cam.jpg' },
  { id: 'prod-47', name: 'Tire Inflator', price: 44.99, stock: 90, status: 'ACTIVE', categoryId: automotive.id, imageUrl: '/images/products/tire-inflator.jpg' },
  { id: 'prod-48', name: 'Car Vacuum', price: 39.99, stock: 105, status: 'ACTIVE', categoryId: automotive.id, imageUrl: '/images/products/car-vacuum.jpg' },

  // Health & Wellness
  { id: 'prod-49', name: 'Vitamin C Supplement', price: 19.99, stock: 180, status: 'ACTIVE', categoryId: health.id, imageUrl: '/images/products/vitamin-c-supplement-health.jpg' },
  { id: 'prod-50', name: 'Protein Powder', price: 49.99, stock: 140, status: 'ACTIVE', categoryId: health.id, imageUrl: '/images/products/protein-powder-health.jpg' },
  { id: 'prod-51', name: 'Electric Toothbrush', price: 59.99, stock: 95, status: 'ACTIVE', categoryId: health.id, imageUrl: '/images/products/electric-toothbrush-health.jpg' },
  { id: 'prod-52', name: 'Massage Gun', price: 89.99, stock: 70, status: 'ACTIVE', categoryId: health.id, imageUrl: '/images/products/massage-gun.jpg' },
  { id: 'prod-53', name: 'Omega-3 Fish Oil', price: 29.99, stock: 160, status: 'ACTIVE', categoryId: health.id, imageUrl: '/images/products/omega-3-fish-oil.jpg' },
  ];

  for (const p of productData) {
    const { id, ...fieldsToUpdate } = p; 
    const prod = await prisma.product.upsert({
      where: { id },
      update: fieldsToUpdate,
      create: { ...p, createdById: admin.id },
    });
    products.push(prod);
  }

const customerData = [
  { id: 'cust-1',  name: 'Esther Howard',        email: 'esther.howard@email.com', phone: '+1 234 567 890', address: '123 Main St, Springfield', avatarUrl: '/images/customers/cust-1.jpg' },
  { id: 'cust-2',  name: 'Cameron Williamson',   email: 'cameron.will@email.com', phone: '+1 234 567 891', address: '456 Oak Ave',          avatarUrl: '/images/customers/cust-2.jpg' },
  { id: 'cust-3',  name: 'Brooklyn Simmons',     email: 'brooklyn.s@email.com',   phone: '+1 234 567 892', address: '789 Pine St',         avatarUrl: '/images/customers/cust-3.jpg' },
  { id: 'cust-4',  name: 'Leslie Alexander',     email: 'leslie.a@email.com',     phone: '+1 234 567 893', address: '321 Elm Rd',          avatarUrl: '/images/customers/cust-4.jpg' },
  { id: 'cust-5',  name: 'Dianne Russell',       email: 'dianne.r@email.com',     phone: '+1 234 567 894', address: '654 Cedar Ln',        avatarUrl: '/images/customers/cust-5.jpg' },
  { id: 'cust-6',  name: 'John Doe',             email: 'john.doe@email.com',     phone: '+1 234 567 895', address: '987 Birch Blvd',       avatarUrl: '/images/customers/cust-6.jpg' },
  { id: 'cust-7',  name: 'Jane Smith',           email: 'jane.smith@email.com',   phone: '+1 234 567 896', address: '111 Walnut St',        avatarUrl: '/images/customers/cust-7.jpg' },
  { id: 'cust-8',  name: 'Robert Brown',         email: 'robert.b@email.com',     phone: '+1 234 567 897', address: '222 Maple Dr',         avatarUrl: '/images/customers/cust-8.jpg' },
  { id: 'cust-9',  name: 'Emily Davis',          email: 'emily.d@email.com',      phone: '+1 234 567 898', address: '333 Oak Ln',           avatarUrl: '/images/customers/cust-9.jpg' },
  { id: 'cust-10', name: 'Michael Wilson',       email: 'michael.w@email.com',    phone: '+1 234 567 899', address: '444 Pine Pl',          avatarUrl: '/images/customers/cust-10.jpg' },
  { id: 'cust-11', name: 'Sarah Taylor',         email: 'sarah.t@email.com',      phone: '+1 234 567 900', address: '555 Cedar Ct',         avatarUrl: '/images/customers/cust-11.jpg' },
  { id: 'cust-12', name: 'David Anderson',       email: 'david.a@email.com',      phone: '+1 234 567 901', address: '666 Birch Rd',         avatarUrl: '/images/customers/cust-12.jpg' },
  { id: 'cust-13', name: 'Laura Thomas',         email: 'laura.t@email.com',      phone: '+1 234 567 902', address: '777 Elm Blvd',         avatarUrl: '/images/customers/cust-13.jpg' },
  { id: 'cust-14', name: 'James Martinez',       email: 'james.m@email.com',      phone: '+1 234 567 903', address: '888 Walnut Way',       avatarUrl: '/images/customers/cust-14.jpg' },
  { id: 'cust-15', name: 'Olivia Garcia',        email: 'olivia.g@email.com',     phone: '+1 234 567 904', address: '999 Maple St',         avatarUrl: '/images/customers/cust-15.jpg' },
  { id: 'cust-16', name: 'Daniel Lee',           email: 'daniel.lee@email.com',   phone: '+1 312 555 1001', address: '1010 Main St',       avatarUrl: '/images/customers/cust-16.jpg' },
  { id: 'cust-17', name: 'Sophia Harris',        email: 'sophia.harris@email.com',phone: '+1 312 555 1002', address: '2020 Oak Ave',       avatarUrl: '/images/customers/cust-17.jpg' },
  { id: 'cust-18', name: 'William Clark',        email: 'william.clark@email.com',phone: '+1 312 555 1003', address: '3030 Pine Rd',       avatarUrl: '/images/customers/cust-18.jpg' },
  { id: 'cust-19', name: 'Ava Lewis',            email: 'ava.lewis@email.com',    phone: '+1 312 555 1004', address: '4040 Cedar Blvd',    avatarUrl: '/images/customers/cust-19.jpg' },
  { id: 'cust-20', name: 'Joseph Walker',        email: 'joseph.walker@email.com',phone: '+1 312 555 1005', address: '5050 Maple Ln',      avatarUrl: '/images/customers/cust-20.jpg' },
  { id: 'cust-21', name: 'Mia Young',            email: 'mia.young@email.com',    phone: '+1 312 555 1006', address: '6060 Birch St',       avatarUrl: '/images/customers/cust-21.jpg' },
  { id: 'cust-22', name: 'Charles Hall',         email: 'charles.hall@email.com', phone: '+1 312 555 1007', address: '7070 Walnut Ave',     avatarUrl: '/images/customers/cust-22.jpg' },
  { id: 'cust-23', name: 'Isabella Allen',       email: 'isabella.allen@email.com',phone:'+1 312 555 1008', address: '8080 Elm Rd',        avatarUrl: '/images/customers/cust-23.jpg' },
  { id: 'cust-24', name: 'Thomas King',          email: 'thomas.king@email.com',  phone: '+1 312 555 1009', address: '9090 Oak Blvd',       avatarUrl: '/images/customers/cust-24.jpg' },
  { id: 'cust-25', name: 'Amelia Wright',        email: 'amelia.wright@email.com',phone: '+1 312 555 1010', address: '1111 Pine Ln',       avatarUrl: '/images/customers/cust-25.jpg' },
  { id: 'cust-26', name: 'Andrew Lopez',         email: 'andrew.lopez@email.com', phone: '+1 312 555 1011', address: '1212 Maple Ave',      avatarUrl: '/images/customers/cust-26.jpg' },
  { id: 'cust-27', name: 'Grace Hill',           email: 'grace.hill@email.com',   phone: '+1 312 555 1012', address: '1313 Cedar Rd',       avatarUrl: '/images/customers/cust-27.jpg' },
  { id: 'cust-28', name: 'Henry Scott',          email: 'henry.scott@email.com',  phone: '+1 312 555 1013', address: '1414 Birch Blvd',      avatarUrl: '/images/customers/cust-28.jpg' },
  { id: 'cust-29', name: 'Chloe Green',          email: 'chloe.green@email.com',  phone: '+1 312 555 1014', address: '1515 Walnut St',      avatarUrl: '/images/customers/cust-29.jpg' },
  { id: 'cust-30', name: 'Jack Adams',           email: 'jack.adams@email.com',   phone: '+1 312 555 1015', address: '1616 Elm Ave',        avatarUrl: '/images/customers/cust-30.jpg' },
];

  const customers = [];

  for (const c of customerData) {
    const cust = await prisma.customer.upsert({
      where: { id: c.id },
      update: {},
      create: {
        ...c,
        ownerId: admin.id,
      },
    });

    customers.push(cust);
  }

  const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
  const orderCount = 520;
  console.log(`📦 Creating ${orderCount} orders...`);

  for (let i = 0; i < orderCount; i++) {
    const orderId = `ord-${(i+1).toString().padStart(4, '0')}`;
    const orderNumber = generateOrderNumber();
    const customer = pickRandom(customers);
    const daysAgoRandom = rand(0, 89);
    const createdAt = daysAgo(daysAgoRandom);
    const status = pickRandom(statuses);
    const itemsCount = rand(1, 4);
    const orderProducts = [];
    const usedProductIds = new Set();

    for (let j = 0; j < itemsCount; j++) {
      let product;

      do {
        product = pickRandom(products);
      } while (usedProductIds.has(product.id));

      usedProductIds.add(product.id);
      orderProducts.push(product);
    }

    let total = 0;
    const orderItemsData = [];
    for (const prod of orderProducts) {
      const qty = rand(1, 5);
      const price = prod.price;
      total += qty * price;
      orderItemsData.push({ productId: prod.id, quantity: qty, price });
    }
    total = Math.round(total * 100) / 100;

    await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.deleteMany({ where: { id: orderId } });

    const order = await prisma.order.create({
      data: {
        id: orderId,
        orderNumber,
        total,
        status,
        customerId: customer.id,
        createdById: admin.id,
        createdAt,
        updatedAt: createdAt,
      },
    });

    for (const item of orderItemsData) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    if ((i+1) % 50 === 0) {
      console.log(`   ✅ ${i+1} orders created`);
    }
  }

  const blogTitles = [
    'Getting Started with E-commerce',
    '10 Tips for Better Customer Service',
    'How to Increase Sales',
    'The Future of Online Shopping',
    'SEO for E-commerce',
    'Social Media Marketing Guide',
    'Email Marketing 101',
    'Inventory Management Tips',
    'Building a Brand Online',
    'Customer Retention Strategies'
  ];
  for (let i = 0; i < blogTitles.length; i++) {
    const id = `blog-${i+1}`;
    await prisma.blog.upsert({
      where: { id },
      update: {},
      create: {
        id,
        title: blogTitles[i],
        content: `Full content for "${blogTitles[i]}"...`,
        slug: blogTitles[i].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        published: i % 3 !== 0,
        authorId: admin.id,
      },
    });
  }

  console.log('🎉 Seed complete!');
  console.log(`   Products: ${products.length}`);
  console.log(`   Customers: ${customers.length}`);
  console.log(`   Orders: ${orderCount}`);
  console.log(`   Blog posts: ${blogTitles.length}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });