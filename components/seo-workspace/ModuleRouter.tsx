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
  SocialPreviewModule,
  WritingAssistantModule,
  KeywordGapModule,
  AppCenterModule,
  OrganicResearchModule,
  AdsPlannerModule,
} from './modules/GenericModule';
import { PageInspectorModule } from './modules/PageInspectorModule';
import { KeywordResearchModule } from './modules/KeywordResearchModule';
import { SearchConsoleModule } from './modules/SearchConsoleModule';
import { TaskManagerModule } from './modules/TaskManagerModule';
import { ReportGeneratorModule } from './modules/ReportGeneratorModule';
import { LockedModule } from './LockedModule';

export function ModuleRouter({ item }: { item: SeoNavItem }) {
  if (!isNavItemLive(item)) {
    return <LockedModule item={item} />;
  }

  // Direct Slug Overrides
  if (item.slug === 'tasks') {
    return <TaskManagerModule />;
  }
  if (item.slug === 'app-center/gsc') {
    return <SearchConsoleModule />;
  }
  if (item.slug === 'on-page-seo') {
    return <PageInspectorModule />;
  }
  if (item.slug === 'reports' || item.slug === 'reports/export' || item.slug === 'reports/brand') {
    return <ReportGeneratorModule />;
  }

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
      return <TopicIdeasModule />;
    case 'writing-assistant':
      return <WritingAssistantModule item={item} />;
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
    case 'app-center':
      return <AppCenterModule item={item} />;
    case 'generic-analyzer':
    default:
      return <ChecklistModule item={item} checklistKey="generic-analyzer" />;
  }
}
