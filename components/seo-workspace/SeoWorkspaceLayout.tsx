'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  SEO_NAV_GROUPS,
  getBreadcrumbs,
  type SeoNavGroup,
  type SeoNavItem,
} from '@/lib/seo/workspace/seoNavConfig';
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

  const crumbs = useMemo(() => getBreadcrumbs(slug), [slug]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-slate-100 dark:bg-slate-950 w-full">
      <aside
        className={`${
          collapsed ? 'w-14' : 'w-64'
        } shrink-0 border-r border-slate-800 bg-slate-950 text-slate-200 flex flex-col transition-[width] duration-200 sticky top-16 h-[calc(100vh-4rem)]`}
      >
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
        <div className="sticky top-16 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 sm:px-6 py-2.5">
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
        </div>
        <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
