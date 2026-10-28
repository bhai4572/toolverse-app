'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SEO_NAV_GROUPS,
  getBreadcrumbs,
  type SeoNavGroup,
  type SeoNavItem,
} from '@/lib/seo/workspace/seoNavConfig';
import {
  getProjects,
  getActiveProject,
  setActiveProjectId,
  createProject,
} from '@/lib/seo/workspace/workspaceStorage';
import type { Project, ProjectScope } from '@/lib/seo/workspace/workspaceTypes';
import {
  ChevronDown,
  ChevronRight,
  Globe2,
  Search,
  Sparkles,
  MapPin,
  FileText,
  Megaphone,
  Radio,
  Share2,
  ClipboardList,
  LayoutGrid,
  PanelLeftClose,
  PanelLeft,
  Home,
  Lock,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react';

function NavLinkLabel({ item, active }: { item: SeoNavItem; active: boolean }) {
  const locked = item.status === 'locked';
  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <span className="truncate">{item.label}</span>
      {locked ? (
        <Lock className="w-3 h-3 shrink-0 text-slate-500" aria-label="Locked" />
      ) : (
        <span
          className={`shrink-0 text-[9px] font-extrabold uppercase tracking-wide px-1 py-0.5 rounded ${
            active ? 'bg-emerald-500/25 text-emerald-300' : 'bg-emerald-500/15 text-emerald-400/90'
          }`}
        >
          Live
        </span>
      )}
    </span>
  );
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe2,
  search: Search,
  sparkles: Sparkles,
  map: MapPin,
  file: FileText,
  megaphone: Megaphone,
  radio: Radio,
  share: Share2,
  clipboard: ClipboardList,
  grid: LayoutGrid,
};

function NavGroup({
  group,
  activeSlug,
  openGroups,
  toggleGroup,
  openItems,
  toggleItem,
}: {
  group: SeoNavGroup;
  activeSlug: string;
  openGroups: Record<string, boolean>;
  toggleGroup: (id: string) => void;
  openItems: Record<string, boolean>;
  toggleItem: (id: string) => void;
}) {
  const Icon = ICONS[group.icon] || Search;
  const isOpen = openGroups[group.id] !== false;

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => toggleGroup(group.id)}
        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wider text-slate-500 hover:bg-slate-800/60 hover:text-slate-200"
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">{group.label}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
      {isOpen && (
        <ul className="mt-0.5 space-y-0.5 pb-2">
          {group.items.map((item) => {
            const active = activeSlug === item.slug || activeSlug.startsWith(`${item.slug}/`);
            const childOpen = openItems[item.id] ?? active;
            return (
              <li key={item.id}>
                <div className="flex items-center">
                  {item.children?.length ? (
                    <button
                      type="button"
                      aria-label="Toggle sub-options"
                      onClick={() => toggleItem(item.id)}
                      className="p-1 text-slate-500 hover:text-slate-200"
                    >
                      {childOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                  ) : (
                    <span className="w-5" />
                  )}
                  <Link
                    href={`/workspace/${item.slug}`}
                    className={`flex-1 min-w-0 px-2 py-1.5 rounded-md text-[13px] font-medium ${
                      activeSlug === item.slug
                        ? 'bg-brand-600/20 text-brand-300'
                        : item.status === 'locked'
                          ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <NavLinkLabel item={item} active={activeSlug === item.slug} />
                  </Link>
                </div>
                {item.children && childOpen && (
                  <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-slate-800 pl-2">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/workspace/${child.slug}`}
                          className={`block min-w-0 px-2 py-1 rounded-md text-[12px] ${
                            activeSlug === child.slug
                              ? 'bg-brand-600/20 text-brand-300 font-semibold'
                              : child.status === 'locked'
                                ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <NavLinkLabel item={child} active={activeSlug === child.slug} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SeoWorkspaceLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SEO_NAV_GROUPS.map((g) => [g.id, true]))
  );
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Tenancy State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProj] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // New Project Form
  const [newProjName, setNewProjName] = useState('');
  const [newProjDomain, setNewProjDomain] = useState('');
  const [newProjScope, setNewProjScope] = useState<ProjectScope>('domain');
  const [newProjCountry, setNewProjCountry] = useState('United States');

  useEffect(() => {
    const list = getProjects();
    setProjects(list);
    setActiveProj(getActiveProject());
  }, []);

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    const updated = getActiveProject();
    setActiveProj(updated);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjDomain.trim()) return;

    const created = createProject({
      name: newProjName.trim() || newProjDomain.replace(/^https?:\/\//i, ''),
      domain: newProjDomain.trim(),
      scope: newProjScope,
      targetCountry: newProjCountry,
    });

    setProjects(getProjects());
    setActiveProj(created);
    setShowProjectModal(false);
    setNewProjName('');
    setNewProjDomain('');
  };

  const handleCopyMetaTag = () => {
    if (!activeProject) return;
    const metaTag = `<meta name="toolverse-site-verification" content="${activeProject.verification.token}" />`;
    navigator.clipboard.writeText(metaTag);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 3000);
  };

  const crumbs = useMemo(() => getBreadcrumbs(slug), [slug]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-slate-100 dark:bg-slate-950 w-full">
      <aside
        className={`${
          collapsed ? 'w-14' : 'w-64'
        } shrink-0 border-r border-slate-800 bg-slate-950 text-slate-200 flex flex-col transition-[width] duration-200 sticky top-16 h-[calc(100vh-4rem)]`}
      >
        {/* Brand & Collapse Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-3 border-b border-slate-800">
          {!collapsed && (
            <Link href="/workspace" className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center text-white shrink-0">
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black truncate">
                  Tool<span className="text-brand-400">Verse</span> SEO
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">FREE</div>
              </div>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Multi-Project Switcher Widget */}
        {!collapsed && activeProject && (
          <div className="p-2 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Active Website
              </span>
              <button
                type="button"
                onClick={() => setShowProjectModal(true)}
                className="text-[11px] font-bold text-brand-400 hover:text-brand-300 inline-flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            <div className="relative">
              <select
                value={activeProject.id}
                onChange={(e) => handleSelectProject(e.target.value)}
                className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 truncate appearance-none focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain.replace(/^https?:\/\//i, '')})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <button
                type="button"
                onClick={() => setShowVerifyModal(true)}
                className={`inline-flex items-center gap-1 font-semibold ${
                  activeProject.verification.verified
                    ? 'text-emerald-400 hover:underline'
                    : 'text-amber-400 hover:underline'
                }`}
              >
                {activeProject.verification.verified ? (
                  <>
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3 h-3" /> Verify Site
                  </>
                )}
              </button>
              <span className="text-slate-500 text-[10px]">{activeProject.targetCountry}</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        {!collapsed && (
          <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="SEO workspace">
            <Link
              href="/workspace"
              className={`flex items-center gap-2 px-2.5 py-2 mb-2 rounded-lg text-[13px] font-semibold ${
                !slug || slug === 'home' ? 'bg-brand-600/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Dashboard Home
            </Link>
            {SEO_NAV_GROUPS.map((group) => (
              <NavGroup
                key={group.id}
                group={group}
                activeSlug={slug}
                openGroups={openGroups}
                toggleGroup={(id) => setOpenGroups((s) => ({ ...s, [id]: !(s[id] !== false) }))}
                openItems={openItems}
                toggleItem={(id) => setOpenItems((s) => ({ ...s, [id]: !s[id] }))}
              />
            ))}
          </nav>
        )}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Top Breadcrumb Header */}
        <div className="sticky top-16 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <nav className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <React.Fragment key={`${c.href}-${i}`}>
                {i > 0 && <span className="text-slate-400">/</span>}
                <Link href={c.href} className="hover:text-brand-600 font-medium truncate max-w-[10rem] sm:max-w-none">
                  {c.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {activeProject && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {activeProject.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                {activeProject.domain.replace(/^https?:\/\//i, '')}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</div>
      </div>

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add New Website / Project
              </h3>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                  Website Domain or URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newProjDomain}
                  onChange={(e) => setNewProjDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                  Project Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Client Brand"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                    Crawl Scope
                  </label>
                  <select
                    value={newProjScope}
                    onChange={(e) => setNewProjScope(e.target.value as ProjectScope)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="domain">Root Domain + Subs</option>
                    <option value="subdomain">Subdomain Only</option>
                    <option value="subfolder">Subfolder Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                    Target Country
                  </label>
                  <select
                    value={newProjCountry}
                    onChange={(e) => setNewProjCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Global">Global / Worldwide</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-bold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ownership Verification Modal */}
      {showVerifyModal && activeProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
                Ownership Verification: {activeProject.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Verify website ownership to unlock privileged actions (such as high-frequency crawling and private Search Console links). Add one of the following verification records to your domain:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Method 1: HTML Meta Tag (Recommended)
                </div>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all select-all">
                  {`<meta name="toolverse-site-verification" content="${activeProject.verification.token}" />`}
                </div>
                <button
                  type="button"
                  onClick={handleCopyMetaTag}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Meta Tag
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Method 2: DNS TXT Record
                </div>
                <div className="text-slate-500 text-[11px]">
                  Add a TXT record to your root domain's DNS:
                </div>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                  toolverse-verify={activeProject.verification.token}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
              >
                Close Verification Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
