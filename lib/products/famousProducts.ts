import { Product } from './types';
import { AI_PRODUCTS } from './data/aiProducts';
import { DEV_PRODUCTS } from './data/devProducts';
import { DESIGN_PRODUCTS } from './data/designProducts';
import { PRODUCTIVITY_PRODUCTS } from './data/productivityProducts';
import { COMMUNICATION_PRODUCTS } from './data/communicationProducts';
import { MARKETING_PRODUCTS } from './data/marketingProducts';
import { BUSINESS_PRODUCTS } from './data/businessProducts';
import { NO_CODE_PRODUCTS } from './data/noCodeProducts';

/**
 * 100 World-Famous Tech Products & Companies
 * High-search-volume, comprehensive profiles for ToolVerse SEO directory
 */
export const FAMOUS_PRODUCTS: Product[] = [
  ...AI_PRODUCTS,            // 15 AI & Machine Learning
  ...DEV_PRODUCTS,           // 15 Developer Tools
  ...DESIGN_PRODUCTS,        // 13 Design & Creative
  ...PRODUCTIVITY_PRODUCTS,  // 15 Productivity & Workspaces
  ...COMMUNICATION_PRODUCTS, // 11 Communication & Team
  ...MARKETING_PRODUCTS,     // 13 Marketing, SEO & Content
  ...BUSINESS_PRODUCTS,      // 10 Business, E-Commerce & Finance
  ...NO_CODE_PRODUCTS        // 8 No-Code & Automation
];

// Re-export individual category collections for granular queries
export {
  AI_PRODUCTS,
  DEV_PRODUCTS,
  DESIGN_PRODUCTS,
  PRODUCTIVITY_PRODUCTS,
  COMMUNICATION_PRODUCTS,
  MARKETING_PRODUCTS,
  BUSINESS_PRODUCTS,
  NO_CODE_PRODUCTS
};
