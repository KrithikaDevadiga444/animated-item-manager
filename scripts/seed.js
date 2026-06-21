require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Item = require('../models/Item');
const Diary = require('../models/Diary');

const DEMO_EMAIL = 'demo@animatedmanager.app';
const DEMO_PASSWORD = 'demo1234';
const DEMO_USERNAME = 'demo';

const sampleItems = [
  { name: 'Organic milk', category: 'Groceries', quantity: 2, status: 'Purchased', notes: '2% reduced fat — fridge restock' },
  { name: 'Whole wheat bread', category: 'Groceries', quantity: 1, status: 'In Use', notes: '' },
  { name: 'Blue ballpoint pens (pack of 10)', category: 'Stationery', quantity: 1, status: 'Purchased', notes: 'For lecture notes' },
  { name: 'A4 ruled notebook', category: 'Stationery', quantity: 3, status: 'Needed', notes: 'Need before next semester' },
  { name: 'USB-C hub', category: 'Electronics', quantity: 1, status: 'In Use', notes: 'HDMI + 3 USB ports' },
  { name: 'Wireless mouse', category: 'Electronics', quantity: 1, status: 'Needed', notes: 'Replace old one — scroll wheel stuck' },
  { name: 'Dish soap', category: 'Household', quantity: 1, status: 'Purchased', notes: '' },
  { name: 'Laundry detergent', category: 'Household', quantity: 1, status: 'Needed', notes: 'Running low' }
];

const sampleDiaryEntries = [
  {
    content: `Started the week with a clear plan: finish the backend routes for my portfolio project and push at least one meaningful commit before Friday. Morning coffee helped — felt focused for the first two hours.

Small win: finally understood how session cookies work end-to-end. It's one of those concepts that clicks only after you trace the full request cycle.`,
    daysAgo: 0
  },
  {
    content: `Went for a long walk after lunch. Sometimes stepping away from the screen is the most productive thing you can do. Came back and spotted a bug in my filter logic within ten minutes — I'd been staring at it for an hour earlier.

Note to self: when stuck, move first, debug second.`,
    daysAgo: 1
  },
  {
    content: `Reading chapter 4 of "Clean Code" tonight. The section on meaningful names hit differently now that I'm naming API routes and database fields myself. "itemsRouter" vs "stuff" — the difference is real.

Grateful for quiet evenings and a desk lamp that doesn't flicker.`,
    daysAgo: 3
  },
  {
    content: `Interview prep day. Practiced explaining REST verbs out loud like I'm teaching someone new to web dev. GET = read, POST = create, PUT = update, DELETE = remove. Sounds simple, but saying it clearly under pressure is harder than it looks.

Feeling nervous but prepared. One step at a time.`,
    daysAgo: 5
  },
  {
    content: `Reorganized my study notes into categories — same idea as the item manager I'm building. Funny how the tools we make mirror the habits we're trying to build.

Tomorrow: groceries, laundry, and maybe an hour of CSS polish. A balanced day.`,
    daysAgo: 7
  }
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (user) {
    console.log('Demo user already exists — clearing old demo data...');
    await Item.deleteMany({ user: user._id });
    await Diary.deleteMany({ user: user._id });
  } else {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    user = await User.create({
      username: DEMO_USERNAME,
      email: DEMO_EMAIL,
      passwordHash
    });
    console.log('Created demo user');
  }

  const now = Date.now();
  await Item.insertMany(
    sampleItems.map(item => ({
      ...item,
      user: user._id,
      createdAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }))
  );
  console.log(`Seeded ${sampleItems.length} items`);

  await Diary.insertMany(
    sampleDiaryEntries.map(entry => ({
      user: user._id,
      content: entry.content,
      createdAt: new Date(now - entry.daysAgo * 24 * 60 * 60 * 1000)
    }))
  );
  console.log(`Seeded ${sampleDiaryEntries.length} diary entries`);

  console.log('\n--- Demo credentials ---');
  console.log(`Email:    ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log('------------------------\n');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
