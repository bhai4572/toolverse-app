import { describe, it, expect } from 'vitest';
import { 
  getAllStartups, 
  getStartupBySlug, 
  submitStartup, 
  upvoteStartup 
} from '../lib/startups/registry';
import { 
  getAllPublishers, 
  getPublisherBySlug, 
  submitGuestPostPitch, 
  getPitchesForApplicant 
} from '../lib/guestposts/registry';
import { 
  generateMetaTitle, 
  generateMetaDescription, 
  generateSlug 
} from '../lib/seotools/generators';

describe('Toolverse Startup Launch & Guest Posting Platform - Core Test Suite', () => {

  describe('1. Startup Directory Registry & Launch Engine', () => {
    it('should return initial startup listings', () => {
      const startups = getAllStartups();
      expect(startups.length).toBeGreaterThan(0);
    });

    it('should filter startups by category and pricing model', () => {
      const aiStartups = getAllStartups({ category: 'AI & Machine Learning' });
      expect(aiStartups.length).toBeGreaterThan(0);
      expect(aiStartups[0].category).toBe('AI & Machine Learning');

      const freemiumStartups = getAllStartups({ pricingModel: 'FREEMIUM' });
      expect(freemiumStartups.every(s => s.pricingModel === 'FREEMIUM')).toBe(true);
    });

    it('should retrieve a startup by slug', () => {
      const startup = getStartupBySlug('nexus-ai-writer');
      expect(startup).toBeDefined();
      expect(startup?.name).toBe('Nexus AI Copywriter');
    });

    it('should handle startup submissions dynamically', () => {
      const newStartup = submitStartup({
        name: 'VisiCode AI',
        tagline: 'AI Code Reviewer for TypeScript',
        websiteUrl: 'https://visicode.example.com',
        category: 'Developer Tools',
        country: 'United States',
        city: 'Seattle',
        pricingModel: 'FREEMIUM',
        fundingStage: 'BOOTSTRAPPED',
        teamSize: '1-5',
        shortDescription: 'AI code review tool for pull requests.',
        longDescription: 'Automates security, performance, and style reviews on GitHub.',
        problemSolved: 'Eliminates code review bottlenecks.',
        targetAudience: ['Developers'],
        keyFeatures: ['GitHub integration', 'Automated security checks'],
        platforms: ['WEB'],
        founderName: 'Sarah Chen',
        founderEmail: 'sarah@visicode.example.com'
      });

      expect(newStartup.id).toBeDefined();
      expect(newStartup.name).toBe('VisiCode AI');

      const retrieved = getStartupBySlug(newStartup.slug);
      expect(retrieved?.name).toBe('VisiCode AI');
    });

    it('should increment upvotes count on upvote action', () => {
      const initial = getStartupBySlug('nexus-ai-writer')!;
      const initialCount = initial.upvotesCount;
      const updatedCount = upvoteStartup(initial.id);
      expect(updatedCount).toBe(initialCount + 1);
    });
  });

  describe('2. Guest Posting & Publisher Marketplace', () => {
    it('should return verified publisher websites', () => {
      const publishers = getAllPublishers();
      expect(publishers.length).toBeGreaterThan(0);
      expect(publishers[0].verificationStatus).toBe('VERIFIED_OWNER');
    });

    it('should filter publishers by niche and domain rating', () => {
      const saasPubs = getAllPublishers({ niche: 'SaaS & Software' });
      expect(saasPubs.length).toBeGreaterThan(0);

      const highDrPubs = getAllPublishers({ minDR: 60 });
      expect(highDrPubs.every(p => p.domainRatingDR >= 60)).toBe(true);
    });

    it('should retrieve a publisher by slug', () => {
      const pub = getPublisherBySlug('tech-vision-journal');
      expect(pub).toBeDefined();
      expect(pub?.websiteName).toBe('TechVision Journal');
    });

    it('should allow submitting an article pitch to an editor', () => {
      const pitch = submitGuestPostPitch({
        publisherId: 'pub-tech-journal',
        publisherName: 'TechVision Journal',
        applicantName: 'Alex Rivera',
        applicantEmail: 'alex@nexusai.example.com',
        applicantCompany: 'Nexus AI',
        proposedTitle: 'Building Resilient SaaS Architectures',
        alternativeTitles: ['Scaling SaaS Backend Systems'],
        articleOutline: '1. Introduction\n2. Architecture\n3. Metrics',
        pitchMessage: 'Hi Editor, here is our pitch.',
        targetUrl: 'https://nexusai.example.com',
        desiredAnchorText: 'Nexus AI SaaS',
        authorBio: 'CTO of Nexus AI',
        sampleWritingUrls: ['https://nexusai.example.com']
      });

      expect(pitch.id).toBeDefined();
      expect(pitch.status).toBe('SUBMITTED');

      const userPitches = getPitchesForApplicant('alex@nexusai.example.com');
      expect(userPitches.some(p => p.proposedTitle === 'Building Resilient SaaS Architectures')).toBe(true);
    });
  });

  describe('3. SEO Toolkit Generators', () => {
    it('should generate valid meta title tags and check length', () => {
      const res = generateMetaTitle('AI SaaS Copywriter');
      expect(res.title).toContain('AI SaaS Copywriter');
      expect(res.characterCount).toBeGreaterThan(0);
      expect(res.status).toBe('OPTIMAL');
    });

    it('should generate valid meta descriptions', () => {
      const res = generateMetaDescription('PostgreSQL visual ERD studio');
      expect(res.description).toContain('PostgreSQL visual ERD studio');
      expect(res.characterCount).toBeGreaterThan(100);
    });

    it('should convert text to clean URL slugs', () => {
      const slug = generateSlug('How to Launch Your SaaS Startup in 2026!');
      expect(slug).toBe('how-to-launch-your-saas-startup-in-2026');
    });
  });
});
