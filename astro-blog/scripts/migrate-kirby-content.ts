// astro-blog/scripts/migrate-kirby-content.ts
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'date-fns';

const KIRBY_CONTENT = '/Volumes/Docker/joe.sh/website/public/content';
const ASTRO_CONTENT = '/Volumes/Docker/joe.sh/astro-blog/src/content/blog';

interface KirbyPost {
  title: string;
  subtitle?: string;
  short?: string;
  date: string;
  status: string;
  theme?: string;
  code?: string;
  text: string;
  folder: string;
}

async function parseKirbyMarkdown(filePath: string): Promise<KirbyPost> {
  const content = await fs.readFile(filePath, 'utf-8');
  const parts = content.split('----').map(p => p.trim());
  
  const fields: Record<string, string> = {};
  for (let i = 0; i < parts.length - 1; i++) {
    const [key, ...valueParts] = parts[i].split(':');
    if (key && valueParts.length) {
      fields[key.trim()] = valueParts.join(':').trim();
    }
  }
  
  return {
    title: fields['Title'] || '',
    subtitle: fields['Subtitle'],
    short: fields['Short'],
    date: fields['Date'] || '',
    status: fields['Status'] || 'Draft',
    theme: fields['Theme'],
    code: fields['Code'],
    text: parts[parts.length - 1],
    folder: path.basename(path.dirname(filePath)),
  };
}

function convertKirbyTextToMDX(text: string): string {
  // Remove "Text:" label at the beginning
  text = text.replace(/^Text:\s*\n/m, '');
  
  // Convert (forkme: repo ribbon: color) to <Forkme repo="repo" ribbon="color" />
  text = text.replace(/\(forkme:\s*([^\s]+)(?:\s+ribbon:\s*([^\)]+))?\)/g, 
    (_, repo, ribbon) => `<Forkme repo="${repo}" ${ribbon ? `ribbon="${ribbon}"` : ''} />`);
  
  // Convert (figure: src caption: text align: center width:100%) to <Figure />
  // Handle multiple formats and parameters
  text = text.replace(/\(figure:\s*([^\s]+)([^)]*)\)/g, (match, src, params) => {
    const props = [`src="${src}"`];
    
    // Extract caption or alt
    const captionMatch = params.match(/(?:caption|alt):\s*([^)]+?)(?:\s+(?:width|align):|$)/);
    if (captionMatch) {
      props.push(`caption="${captionMatch[1].trim()}"`);
    }
    
    // Extract align
    const alignMatch = params.match(/align:\s*([^\s]+)/);
    if (alignMatch) {
      props.push(`align="${alignMatch[1].trim()}"`);
    }
    
    // Note: width is not a standard prop, will need manual review
    
    return `<Figure ${props.join(' ')} />`;
  });
  
  // Convert (heading: text id: myid el: h3) to <Heading />
  text = text.replace(/\(heading:\s*([^)]+?)\s+id:\s*([^\s]+)(?:\s+el:\s*([^\)]+))?\)/g,
    (_, heading, id, level) => `<Heading text="${heading.trim()}" id="${id}" ${level ? `level="${level}"` : ''} />`);
  
  return text;
}

async function migratePost(folderPath: string) {
  const defaultMd = path.join(folderPath, 'default.md');
  
  try {
    const post = await parseKirbyMarkdown(defaultMd);
    
    // Parse date (format: "Aug 29, 2010 11:07pm" or "April 3, 2014 11:32am")
    const dateMatch = post.date.match(/([A-Za-z]+)\s+(\d+),\s+(\d+)/);
    if (!dateMatch) return;
    
    const [, month, day, year] = dateMatch;
    // Try full month name first, then abbreviated
    let parsedDate = parse(`${month} ${day} ${year}`, 'MMMM d yyyy', new Date());
    if (isNaN(parsedDate.getTime())) {
      parsedDate = parse(`${month} ${day} ${year}`, 'MMM d yyyy', new Date());
    }
    const slug = post.folder.replace(/^\d+-/, '');
    const filename = `${parsedDate.toISOString().split('T')[0]}-${slug}.mdx`;
    
    // Convert KirbyText to MDX
    const content = convertKirbyTextToMDX(post.text);
    
    // Check for hero image
    const heroImagePath = path.join(folderPath, 'hero.jpg');
    let heroImage = '';
    try {
      await fs.access(heroImagePath);
      heroImage = `./images/${slug}/hero.jpg`;
      
      // Copy images
      const imageDir = path.join(ASTRO_CONTENT, 'images', slug);
      await fs.mkdir(imageDir, { recursive: true });
      await fs.copyFile(heroImagePath, path.join(imageDir, 'hero.jpg'));
    } catch {}
    
    // Copy all other images
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      if (/\.(jpg|png|gif)$/i.test(file) && file !== 'hero.jpg') {
        const srcPath = path.join(folderPath, file);
        const imageDir = path.join(ASTRO_CONTENT, 'images', slug);
        await fs.mkdir(imageDir, { recursive: true });
        await fs.copyFile(srcPath, path.join(imageDir, file));
      }
    }
    
    // Generate frontmatter - build only non-empty fields
    const frontmatterFields = [
      `title: "${post.title.replace(/"/g, '\\"')}"`,
      post.subtitle ? `subtitle: "${post.subtitle.replace(/"/g, '\\"')}"` : null,
      post.short ? `short: "${post.short.replace(/"/g, '\\"')}"` : null,
      `date: ${parsedDate.toISOString()}`,
      `status: ${post.status}`,
      post.theme ? `theme: ${post.theme}` : null,
      post.code === 'true' ? 'code: true' : null,
      heroImage ? `heroImage: "${heroImage}"` : null,
    ].filter(Boolean).join('\n');
    
    const imports = (content.includes('<Figure') || content.includes('<Forkme') || content.includes('<Heading'))
      ? `import Figure from '@components/Figure.astro';
import Forkme from '@components/Forkme.astro';
import Heading from '@components/Heading.astro';`
      : '';
    
    const frontmatter = `---
${frontmatterFields}
---
${imports ? '\n' + imports + '\n' : ''}
${content}`;
    
    // Write to new location
    await fs.writeFile(path.join(ASTRO_CONTENT, filename), frontmatter, 'utf-8');
    console.log(`✓ Migrated: ${filename}`);
    
  } catch (error) {
    console.error(`✗ Failed to migrate ${folderPath}:`, error);
  }
}

async function migrate() {
  // Create destination directory
  await fs.mkdir(ASTRO_CONTENT, { recursive: true });
  await fs.mkdir(path.join(ASTRO_CONTENT, 'images'), { recursive: true });
  
  // Get all post folders
  const items = await fs.readdir(KIRBY_CONTENT);
  
  for (const item of items) {
    const itemPath = path.join(KIRBY_CONTENT, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory() && /^\d+-/.test(item)) {
      await migratePost(itemPath);
    }
  }
  
  console.log('\n✓ Migration complete!');
}

migrate();
