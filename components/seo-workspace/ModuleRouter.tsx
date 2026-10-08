'use client';

import React from 'react';
import type { SeoNavItem } from '@/lib/seo/workspace/seoNavConfig';
import { isNavItemLive } from '@/lib/seo/workspace/seoNavConfig';
import {
  UrlAuditModule,
  OnPageModule,
  SitePerformanceModule,
  DomainOverviewModule,
  KeywordMagicModule,
  PositionTrackingModule,
  LinkExtractorModule,
  BacklinkChecklistModule,
  ContentOptimizerModule,
  TopicIdeasModule,
  TrafficYourDataModule,
  ReportExportModule,
} from './modules/PriorityModules';
import {
  ChecklistModule,
  SocialPreviewModule,
  WritingAssistantModule,
  KeywordGapModule,
  AppCenterModule,
  OrganicResearchModule,
  AdsPlannerModule,
} from './modules/GenericModule';
import { LockedModule } from './LockedModule';

export function ModuleRouter({ item }: { item: SeoNavItem }) {
  if (!isNavItemLive(item)) {
    return <LockedModule item={item} />;
  }

  switch (item.kind) {
    case 'url-audit':
      return <UrlAuditModule title={item.label} moduleId={item.id} />;
    case 'on-page':
      return <OnPageModule />;
    case 'site-performance':
      return <SitePerformanceModule />;
    case 'domain-overview':
      return <DomainOverviewModule />;
    case 'keyword-overview':
      return <KeywordMagicModule title="Keyword Overview" />;
    case 'keyword-magic':
      return <KeywordMagicModule title="Keyword Magic" />;
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
      return <TopicIdeasModule />;
    case 'writing-assistant':
      return <WritingAssistantModule item={item} />;
    case 'traffic-your-data':
      return <TrafficYourDataModule title={item.label} />;
    case 'market-explorer':
      return <ChecklistModule item={item} checklistKey="market-explorer" />;
    case 'ai-visibility':
      return <ChecklistModule item={item} checklistKey="ai-visibility" />;
    case 'local-checklist':
      return <ChecklistModule item={item} checklistKey="local-checklist" />;
    case 'ads-planner':
      return <AdsPlannerModule item={item} />;
    case 'ai-pr':
      return <ChecklistModule item={item} checklistKey="ai-pr" />;
    case 'social-preview':
      return <SocialPreviewModule item={item} />;
    case 'report-export':
      return <ReportExportModule />;
    case 'app-center':
      return <AppCenterModule item={item} />;
    case 'generic-analyzer':
    default:
      return <ChecklistModule item={item} checklistKey="generic-analyzer" />;
  }
}
