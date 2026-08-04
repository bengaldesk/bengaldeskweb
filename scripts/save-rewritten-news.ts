import { PrismaClient } from '@prisma/client'
import fs from 'fs';

const prisma = new PrismaClient()

async function main() {
  const filename = process.argv[2] || 'rewritten_news.json';
  const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  const authorId = 'cmsen0nhk0000f7eo7nc0tf43'; // The System Agent user

  for (const item of data) {
    try {
      const post = await prisma.post.create({
        data: {
          title: item.title,
          summary: item.summary,
          content: item.content,
          image: item.image,
          category: item.section,
          sourceUrl: item.link,
          sourceName: item.source,
          metaTitle: item.metaTitle,
          metaDescription: item.metaDescription,
          metaKeywords: item.metaKeywords,
          published: true,
          authorId: authorId,
        },
      });
      console.log(`Saved: ${post.title}`);
    } catch (e) {
      console.error(`Error saving ${item.title}: ${e.message}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
