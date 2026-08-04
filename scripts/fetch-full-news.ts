import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fs from 'fs';

const parser = new Parser();

const sectionMap: Record<string, string> = {
  'বাংলাদেশ': 'বাংলাদেশ', 'bangladesh': 'বাংলাদেশ', 'জেলা': 'বাংলাদেশ', 'রাজনীতি': 'বাংলাদেশ', 'রাজধানী': 'বাংলাদেশ', 'অপরাধ': 'বাংলাদেশ',
  'International': 'আন্তর্জাতিক', 'লাতিন আমেরিকা': 'আন্তর্জাতিক', 'যুক্তরাষ্ট্র': 'আন্তর্জাতিক', 'মধ্যপ্রাচ্য': 'আন্তর্জাতিক', 'ভারত': 'আন্তর্জাতিক', 'এশিয়া': 'আন্তর্জাতিক',
  'ফুটবল': 'খেলা', 'ক্রিকেট': 'খেলা', 'অন্য খেলা': 'খেলা', 'sports': 'খেলা',
  'নাটক': 'বিনোদন', 'গান': 'বিনোদন', 'বলিউড': 'বিনোদন', 'ঢালিউড': 'বিনোদন', 'entertainment': 'বিনোদন',
  'অর্থনীতি': 'অর্থনীতি', 'করপোরেট সংবাদ': 'অর্থনীতি', 'বিশ্ববাণিজ্য': 'অর্থনীতি', 'economy': 'অর্থনীতি',
  'প্রযুক্তি': 'তথ্যপ্রযুক্তি', 'বিজ্ঞান': 'তথ্যপ্রযুক্তি', 'গ্যাজেট': 'তথ্যপ্রযুক্তি', 'tech': 'তথ্যপ্রযুক্তি',
};

async function getFullContent(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Try common selectors
    let content = $('.story-element-text, .field-name-body, .article-content, div[itemprop="articleBody"], .story-content, .article-body').text().trim();
    
    if (!content) {
      // Fallback to all p tags in main area
      content = $('article p, main p').text().trim();
    }

    const image = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');

    return { content, image };
  } catch (error) {
    return { content: '', image: '' };
  }
}

const sources = [
  { name: 'Prothom Alo Top', url: 'https://www.prothomalo.com/stories.rss', section: null },
  { name: 'Prothom Alo Tech', url: 'https://www.prothomalo.com/technology/stories.rss', section: 'তথ্যপ্রযুক্তি' },
  { name: 'The Daily Star Top', url: 'https://www.thedailystar.net/rss.xml', section: null },
  { name: 'The Daily Star Sports', url: 'https://www.thedailystar.net/sports/rss.xml', section: 'খেলা' },
  { name: 'The Daily Star Ent', url: 'https://www.thedailystar.net/entertainment/rss.xml', section: 'বিনোদন' },
  { name: 'The Daily Star Tech', url: 'https://www.thedailystar.net/tech-and-startup/rss.xml', section: 'তথ্যপ্রযুক্তি' },
  { name: 'The Daily Star Biz', url: 'https://www.thedailystar.net/business/rss.xml', section: 'অর্থনীতি' },
  { name: 'Samakal Top', url: 'https://samakal.com/rss', section: null },
  { name: 'TBS News Top', url: 'https://www.tbsnews.net/rss.xml', section: null },
  { name: 'BBC Bengali', url: 'https://feeds.bbci.co.uk/bengali/rss.xml', section: 'আন্তর্জাতিক' },
  { name: 'Tech Shohor', url: 'https://www.techshohor.com/feed', section: 'তথ্যপ্রযুক্তি' },
];

async function fetchAll() {
  const newsBySection: Record<string, any[]> = {
    'বাংলাদেশ': [],
    'আন্তর্জাতিক': [],
    'খেলা': [],
    'বিনোদন': [],
    'অর্থনীতি': [],
    'তথ্যপ্রযুক্তি': [],
  };

  const seenLinks = new Set();

  for (const source of sources) {
    console.log(`Fetching from ${source.name}...`);
    try {
      const response = await fetch(source.url);
      const xml = await response.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      
      const items = $('item');
      console.log(`  Found ${items.length} items`);

      for (let i = 0; i < items.length; i++) {
        const item = items.eq(i);
        let title = item.find('title').text().trim();
        if (title.includes('<a')) {
          title = cheerio.load(title).text().trim();
        }
        
        const link = item.find('link').text().trim() || item.find('guid').text().trim();
        
        if (seenLinks.has(link)) continue;
        seenLinks.add(link);

        let section = source.section || 'অন্যান্য';
        if (!source.section) {
          // Detect section from categories or title
          const cats = item.find('category').map((_, el) => $(el).text()).get();
          for (const cat of cats) {
            if (sectionMap[cat]) {
              section = sectionMap[cat];
              break;
            }
          }
        }

        if (newsBySection[section] && newsBySection[section].length < 15) {
          console.log(`  Getting full content for: ${title}`);
          const { content, image } = await getFullContent(link);
          if (content.length > 200) {
            newsBySection[section].push({
              title,
              source: source.name,
              link,
              originalContent: content,
              image,
              section
            });
          }
        }
      }
    } catch (e) {
      console.error(`Error with ${source.name}: ${e.message}`);
    }
  }
  return newsBySection;
}

fetchAll().then(data => {
  fs.writeFileSync('full_news.json', JSON.stringify(data, null, 2));
  console.log('Saved to full_news.json');
});
