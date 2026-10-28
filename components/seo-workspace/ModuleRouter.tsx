'use client';

import React from 'react';
import type { SeoNavItem } from '@/lib/seo/workspace/seoNavConfig';
import { isNavItemLive } from '@/lib/seo/workspace/seoNavConfig';
import {
  UrlAuditModule,
  SiteAuditModule,
  SitePerformanceModule,
  DomainOverviewModule,
  PositionTrackingModule,
  LinkExtractorModule,
  BacklinkChecklistModule,
  ContentOptimizerModule,
  TopicIdeasModule,
} from './modules/PriorityModules';
import {
  ChecklistModule,
  KeywordGapModule,
  OrganicResearchModule,
} from './modules/GenericModule';
import { PageInspectorModule } from './modules/PageInspectorModule';
import { KeywordResearchModule } from './modules/KeywordResearchModule';
import { SearchConsoleModule } from './modules/SearchConsoleModule';
import { TaskManagerModule } from './modules/TaskManagerModule';
import { ReportGeneratorModule } from './modules/ReportGeneratorModule';
import { ContentWorkspaceModule } from './modules/ContentWorkspaceModule';
import { AdsWorkspaceModule } from './modules/AdsWorkspaceModule';
import { SocialWorkspaceModule } from './modules/SocialWorkspaceModule';
import { LocalSeoSuiteModule } from './modules/LocalSeoSuiteModule';
import { AiVisibilitySuiteModule } from './modules/AiVisibilitySuiteModule';
import { AiPrSuiteModule } from './modules/AiPrSuiteModule';
import { MarketExplorerModule } from './modules/MarketExplorerModule';
import { AppCenterSuiteModule } from './modules/AppCenterSuiteModule';
import { LinkOutreachModule } from './modules/LinkOutreachModule';
import { LockedModule } from './LockedModule';

export function ModuleRouter({ item }: { item: SeoNavItem }) {
  if (!isNavItemLive(item)) {
    return <LockedModule item={item} />;
  }

  // 1. Direct Slug Routing for Rich Suites
  // Tasks
  if (item.slug === 'tasks') {
    return <TaskManagerModule />;
  }

  // Reports
  if (item.slug === 'reports' || item.slug === 'reports/export' || item.slug === 'reports/brand') {
    return <ReportGeneratorModule />;
  }

  // Content Workspace
  if (item.slug === 'content/writing') {
    return <ContentWorkspaceModule mode="writing" />;
  }
  if (item.slug === 'content/topics') {
    return <ContentWorkspaceModule mode="topics" />;
  }
  if (item.slug === 'content/brief') {
    return <ContentWorkspaceModule mode="brief" />;
  }

  // Advertising Workspace
  if (item.slug === 'ads/research' || item.slug === 'ads/ppc-keywords') {
    return <AdsWorkspaceModule initialTab="ppc-keywords" />;
  }
  if (item.slug === 'ads/copy') {
    return <AdsWorkspaceModule initialTab="copy" />;
  }

  // Social Workspace
  if (item.slug === 'social/preview') {
    return <SocialWorkspaceModule initialTab="preview" />;
  }
  if (item.slug === 'social/calendar') {
    return <SocialWorkspaceModule initialTab="calendar" />;
  }
  if (item.slug === 'social/utm') {
    return <SocialWorkspaceModule initialTab="utm" />;
  }
  if (item.slug === 'social/hashtags') {
    return <SocialWorkspaceModule initialTab="hashtags" />;
  }

  // Local SEO Suite
  if (item.slug === 'local/map-rank') {
    return <LocalSeoSuiteModule initialTab="listings" />;
  }
  if (item.slug === 'local/gbp') {
    return <LocalSeoSuiteModule initialTab="schema" />;
  }
  if (item.slug === 'local/listings' || item.slug === 'listing-management') {
    return <LocalSeoSuiteModule initialTab="listings" />;
  }
  if (item.slug === 'local/reviews') {
    return <LocalSeoSuiteModule initialTab="reviews" />;
  }

  // AI Visibility Suite
  if (item.slug === 'ai-visibility') {
    return <AiVisibilitySuiteModule initialTab="llms" />;
  }
  if (item.slug === 'ai-visibility/prompts') {
    return <AiVisibilitySuiteModule initialTab="prompts" />;
  }
  if (item.slug === 'ai-visibility/brand' || item.slug === 'ai-visibility/citations') {
    return <AiVisibilitySuiteModule initialTab="entity" />;
  }

  // AI PR Suite
  if (item.slug === 'ai-pr/pitch') {
    return <AiPrSuiteModule initialTab="pitch" />;
  }
  if (item.slug === 'ai-pr/media') {
    return <AiPrSuiteModule initialTab="media" />;
  }
  if (item.slug === 'ai-pr/monitor') {
    return <AiPrSuiteModule initialTab="mentions" />;
  }

  // Market & Audience
  if (item.slug === 'market-explorer' || item.slug === 'traffic-analytics/competitors') {
    return <MarketExplorerModule initialTab="competitors" />;
  }
  if (item.slug === 'audience-insights') {
    return <MarketExplorerModule initialTab="persona" />;
  }
  if (item.slug === 'trend-watch') {
    return <MarketExplorerModule initialTab="trends" />;
  }

  // Link Building Outreach
  if (item.slug === 'link-building/outreach') {
    return <LinkOutreachModule />;
  }

  // App Center
  if (item.slug === 'app-center') {
    return <AppCenterSuiteModule initialTab="apps" />;
  }
  if (item.slug === 'app-center/gsc') {
    return <SearchConsoleModule />;
  }
  if (item.slug === 'app-center/ga4') {
    return <AppCenterSuiteModule initialTab="ga4" />;
  }
  if (item.slug === 'app-center/tools') {
    return <AppCenterSuiteModule initialTab="tools" />;
  }

  // On-Page SEO Checker
  if (item.slug === 'on-page-seo') {
    return <PageInspectorModule />;
  }

  // 2. Kind-based Routing
  switch (item.kind) {
    case 'url-audit':
      if (item.id === 'site-audit' || item.slug === 'site-audit') {
        return <SiteAuditModule />;
      }
      return <UrlAuditModule title={item.label} moduleId={item.id} />;
    case 'on-page':
      return <PageInspectorModule />;
    case 'task-manager':
      return <TaskManagerModule />;
    case 'keyword-overview':
    case 'keyword-magic':
      return <KeywordResearchModule title={item.label} />;
    case 'traffic-your-data':
      return <SearchConsoleModule />;
    case 'report-export':
      return <ReportGeneratorModule />;
    case 'site-performance':
      return <SitePerformanceModule />;
    case 'domain-overview':
      return <DomainOverviewModule />;
    case 'keyword-gap':
      return <KeywordGapModule item={item} />;
    case 'position-tracking':
      return <PositionTrackingModule />;
    case 'organic-research':
      return <OrganicResearchModule item={item} />;
    case 'link-extractor':
      return <LinkExtractorModule />;
    case 'backlink-checklist':
      return <BacklinkChecklistModule />;
    case 'content-optimizer':
      return <ContentOptimizerModule />;
    case 'topic-ideas':
      return <ContentWorkspaceModule mode="topics" />;
    case 'writing-assistant':
      return <ContentWorkspaceModule mode="writing" />;
    case 'market-explorer':
      return <MarketExplorerModule initialTab="competitors" />;
    case 'ai-visibility':
      return <AiVisibilitySuiteModule initialTab="llms" />;
    case 'local-checklist':
      return <LocalSeoSuiteModule initialTab="schema" />;
    case 'ads-planner':
      return <AdsWorkspaceModule initialTab="ppc-keywords" />;
    case 'ai-pr':
      return <AiPrSuiteModule initialTab="pitch" />;
    case 'social-preview':
      return <SocialWorkspaceModule initialTab="preview" />;
    case 'app-center':
      return <AppCenterSuiteModule initialTab="apps" />;
    case 'generic-analyzer':
    default:
      return <ChecklistModule item={item} checklistKey="generic-analyzer" />;
  }
}
