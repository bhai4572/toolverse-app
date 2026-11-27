import { describe, it, expect } from 'vitest';
import {
  INITIAL_STARTUPS,
  getAllStartups,
  getStartupBySlug,
  submitStartup,
  upvoteStartup,
} from '../lib/startups/registry';
import {
  SAMPLE_PUBLISHERS,
  getAllPublishers,
  getPublisherBySlug,
  registerPublisherWebsite,
  submitGuestPostPitch,
  getPitchesForApplicant,
} from '../lib/guestposts/registry';
import {
  generateMetaTitle,
  generateMetaDescription,
  generateSlug,
} from '../lib/seotools/generators';

describe('Toolverse Startup Launch & Guest Posting Platform - Core Test Suite', () => {
  describe('1. Startup Directory Registry & Launch Engine', () => {
    it('ships zero hardcoded demo/sample startups on public pages', () => {
      expect(INITIAL_STARTUPS.length).toBe(0);
    });

    it('handles dynamic startup submissions, filtering, retrieval, and upvoting', () => {
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
        founderName: 'Test Founder',
        founderEmail: 'founder@visicode.example.com',
      });

      expect(newStartup.id).toBeDefined();
      expect(newStartup.name).toBe('VisiCode AI');

      const retrieved = getStartupBySlug(newStartup.slug);
      expect(retrieved?.name).toBe('VisiCode AI');

      const devStartups = getAllStartups({ category: 'Developer Tools' });
      expect(devStartups.length).toBeGreaterThan(0);

      const freemiumStartups = getAllStartups({ pricingModel: 'FREEMIUM' });
      expect(freemiumStartups.every((s) => s.pricingModel === 'FREEMIUM')).toBe(true);

      const initialCount = newStartup.upvotesCount;
      const updatedCount = upvoteStartup(newStartup.id);
      expect(updatedCount).toBe(initialCount + 1);
    });
  });

  describe('2. Guest Posting & Publisher Marketplace', () => {
    it('ships zero hardcoded demo/sample publishers on public pages', () => {
      expect(SAMPLE_PUBLISHERS.length).toBe(0);
    });

    it('supports registering a publisher, filtering, and submitting an article pitch', () => {
      const pub = registerPublisherWebsite({
        websiteName: 'Engineering Notes',
        websiteUrl: 'https://engineeringnotes.example.org',
        niche: 'SaaS & Software',
        domainRatingDR: 62,
        domainAuthorityDA: 58,
      });

      expect(getPublisherBySlug(pub.slug)?.websiteName).toBe('Engineering Notes');
      expect(getAllPublishers({ niche: 'SaaS & Software' }).length).toBeGreaterThan(0);
      expect(getAllPublishers({ minDR: 60 }).every((p) => p.domainRatingDR >= 60)).toBe(true);

      const pitch = submitGuestPostPitch({
        publisherId: pub.id,
        publisherName: pub.websiteName,
        applicantName: 'Test Author',
        applicantEmail: 'author@example.com',
        applicantCompany: 'Test Org',
        proposedTitle: 'Building Resilient SaaS Architectures',
        alternativeTitles: ['Scaling SaaS Backend Systems'],
        articleOutline: '1. Introduction\n2. Architecture\n3. Metrics',
        pitchMessage: 'Hi Editor, here is our pitch.',
        targetUrl: 'https://example.com',
        desiredAnchorText: 'SaaS architecture guide',
        authorBio: 'Software Engineer',
        sampleWritingUrls: ['https://example.com'],
      });

      expect(pitch.id).toBeDefined();
      expect(pitch.status).toBe('SUBMITTED');

      const userPitches = getPitchesForApplicant('author@example.com');
      expect(userPitches.some((p) => p.proposedTitle === 'Building Resilient SaaS Architectures')).toBe(true);
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
