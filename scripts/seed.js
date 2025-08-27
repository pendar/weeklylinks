/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNr = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNr + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const week = 1 + Math.round(((d - firstThursday) / 86400000 - 3) / 7)
  return { year: d.getUTCFullYear(), week }
}

async function main() {
  // Create new categories as requested
  const tool = await prisma.category.upsert({ where: { slug: 'tool' }, update: {}, create: { name: 'Tool', slug: 'tool' } })
  const article = await prisma.category.upsert({ where: { slug: 'article' }, update: {}, create: { name: 'Article', slug: 'article' } })
  const post = await prisma.category.upsert({ where: { slug: 'post' }, update: {}, create: { name: 'Post', slug: 'post' } })
  const inspiration = await prisma.category.upsert({ where: { slug: 'inspiration' }, update: {}, create: { name: 'Inspiration', slug: 'inspiration' } })

  const categories = [tool, article, post, inspiration]

  const now = new Date()
  const lastWeek = new Date(now); lastWeek.setDate(now.getDate() - 7)
  const k = isoWeekKey(lastWeek)
  const start = new Date(Date.UTC(k.year, 0, 4 + (k.week - 1) * 7))

  for (let i = 0; i < 8; i++) {
    await prisma.card.create({
      data: {
        title: `Sample ${categories[i % 4].name} ${i + 1}`,
        description: `This is a great ${categories[i % 4].name.toLowerCase()} that demonstrates the category.`,
        sourceName: 'Example Source',
        sourceUrl: 'https://example.com',
        type: 'solid',
        colorScheme: 'light',
        categoryId: categories[i % 4].id,
        status: 'published',
        position: i,
        publishedAt: new Date(start.getTime() + i * 60 * 60 * 1000)
      }
    })
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); return prisma.$disconnect() })



