import { Product, ProductCategory } from './types';
import { getStoredProducts, getStoredCategories, getProductVoteDelta } from './storageEngine';
import { FAMOUS_PRODUCTS } from './famousProducts';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { slug: 'ai-tools', name: 'AI & Machine Learning', icon: 'Sparkles', description: 'Artificial intelligence assistants, image generators, LLMs, and automation engines.' },
  { slug: 'developer-tools', name: 'Developer Tools', icon: 'Code', description: 'APIs, cloud databases, IDEs, CI/CD pipelines, and backend infrastructure.' },
  { slug: 'design-creative', name: 'Design & Creative', icon: 'Palette', description: 'UI/UX tools, graphic creation, vector editors, and 3D animation software.' },
  { slug: 'productivity-workspaces', name: 'Productivity & Workspaces', icon: 'CheckSquare', description: 'Task managers, notes, team workspaces, document editing, and project tracking.' },
  { slug: 'communication-collaboration', name: 'Communication & Team', icon: 'MessageSquare', description: 'Team messaging, video conferencing, community forums, and asynchronous video.' },
  { slug: 'marketing-seo', name: 'Marketing, SEO & Content', icon: 'TrendingUp', description: 'Keyword research, email marketing, analytics, social media management, and newsletter platforms.' },
  { slug: 'business-finance', name: 'Business, E-Commerce & Finance', icon: 'Briefcase', description: 'Invoicing, CRM, payment gateways, accounting, and e-commerce platforms.' },
  { slug: 'no-code-automation', name: 'No-Code & Automation', icon: 'Zap', description: 'App builders, visual workflows, internal tools, and database synchronization.' },
];

export const PRODUCTS: Product[] = FAMOUS_PRODUCTS;

export function getAllCategories(): ProductCategory[] {
  const custom = getStoredCategories();
  const map = new Map<string, ProductCategory>();
  for (const c of PRODUCT_CATEGORIES) {
    map.set(c.slug, c);
  }
  for (const c of custom) {
    map.set(c.slug, c);
  }
  return Array.from(map.values());
}

export function getAllProducts(): Product[] {
  const custom = getStoredProducts();
  const map = new Map<string, Product>();

  // Add custom products first (so they take precedence)
  for (const p of custom) {
    const delta = getProductVoteDelta(p.id);
    map.set(p.slug, {
      ...p,
      upvotesCount: Math.max(1, p.upvotesCount + delta),
    });
  }

  // Add static products
  for (const p of PRODUCTS) {
    if (!map.has(p.slug)) {
      const delta = getProductVoteDelta(p.id);
      map.set(p.slug, {
        ...p,
        upvotesCount: Math.max(0, p.upvotesCount + delta),
      });
    }
  }

  return Array.from(map.values());
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  const all = getAllProducts();
  return all.find((p) => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const all = getAllProducts();
  if (categorySlug === 'all') return all;
  return all.filter((p) => p.categorySlug === categorySlug && p.status === 'approved');
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.isFeatured && p.status === 'approved');
}

export function getTrendingProducts(): Product[] {
  return getAllProducts().filter((p) => p.isTrending && p.status === 'approved');
}

export function getNewProducts(): Product[] {
  return getAllProducts().filter((p) => p.isNew || p.status === 'approved').slice(0, 10);
}

export function getLeaderboardProducts(
  timeframe: 'all' | 'today' | 'week' | 'new' = 'all',
  categorySlug: string = 'all'
): Product[] {
  let list = getAllProducts().filter((p) => p.status === 'approved');

  if (categorySlug && categorySlug !== 'all') {
    list = list.filter((p) => p.categorySlug === categorySlug);
  }

  if (timeframe === 'new') {
    return list.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
  }

  if (timeframe === 'today') {
    const today = new Date().toISOString().split('T')[0];
    const todayList = list.filter((p) => p.launchDate === today || p.isNew);
    if (todayList.length > 0) {
      return todayList.sort((a, b) => b.upvotesCount - a.upvotesCount);
    }
  }

  if (timeframe === 'week') {
    return list.sort((a, b) => (b.upvotesCount * 2 + b.viewsCount) - (a.upvotesCount * 2 + a.viewsCount));
  }

  // All-time top voted
  return list.sort((a, b) => b.upvotesCount - a.upvotesCount);
}
