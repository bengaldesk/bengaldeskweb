import bcrypt from 'bcryptjs'
import { db } from '../src/lib/db'

async function seed() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await db.user.upsert({
    where: { email: 'admin@bengaldesk.com' },
    update: {},
    create: {
      email: 'admin@bengaldesk.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
      active: true,
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 10)
  const editor = await db.user.upsert({
    where: { email: 'editor@bengaldesk.com' },
    update: {},
    create: {
      email: 'editor@bengaldesk.com',
      password: editorPassword,
      name: 'Editor',
      role: 'editor',
      active: true,
    },
  })
  console.log(`Created editor user: ${editor.email}`)

  // Create categories
  const categories = [
    { name: 'National', nameBn: 'জাতীয়', slug: 'national', order: 1 },
    { name: 'International', nameBn: 'আন্তর্জাতিক', slug: 'international', order: 2 },
    { name: 'Politics', nameBn: 'রাজনীতি', slug: 'politics', order: 3 },
    { name: 'Sports', nameBn: 'খেলা', slug: 'sports', order: 4 },
    { name: 'Entertainment', nameBn: 'বিনোদন', slug: 'entertainment', order: 5 },
    { name: 'Technology', nameBn: 'প্রযুক্তি', slug: 'technology', order: 6 },
    { name: 'Economy', nameBn: 'অর্থনীতি', slug: 'economy', order: 7 },
    { name: 'Lifestyle', nameBn: 'লাইফস্টাইল', slug: 'lifestyle', order: 8 },
    { name: 'Health', nameBn: 'স্বাস্থ্য', slug: 'health', order: 9 },
    { name: 'Opinion', nameBn: 'মতামত', slug: 'opinion', order: 10 },
  ]

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        nameBn: cat.nameBn,
        slug: cat.slug,
        order: cat.order,
        active: true,
      },
    })
    console.log(`Created category: ${cat.nameBn} (${cat.slug})`)
  }

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'The Bengal Desk' },
    { key: 'site_description', value: 'The Bengal Desk - Professional News Management System' },
    { key: 'site_logo', value: '/logo.png' },
    { key: 'posts_per_page', value: '12' },
  ]

  for (const setting of settings) {
    await db.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
    console.log(`Set setting: ${setting.key} = ${setting.value}`)
  }

  // Create a sample poll
  const existingPoll = await db.poll.findFirst()
  if (!existingPoll) {
    const poll = await db.poll.create({
      data: {
        question: 'আপনি কোন বিষয়ে সবচেয়ে বেশি সংবাদ পড়তে চান?',
        active: true,
        options: {
          create: [
            { text: 'জাতীয় সংবাদ', votes: 0 },
            { text: 'আন্তর্জাতিক সংবাদ', votes: 0 },
            { text: 'খেলাধুলা', votes: 0 },
            { text: 'বিনোদন', votes: 0 },
          ],
        },
      },
    })
    console.log(`Created poll with ${poll.question}`)
  }

  console.log('Seed completed!')
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
