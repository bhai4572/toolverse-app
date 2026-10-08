import React, { useState } from 'react';
import { 
  generateMetaTitle, 
  generateMetaDescription, 
  generateRobotsTxt, 
  generateSlug,
  generateFaqSchemaJsonLd,
  generateGuestPostPitchTemplate 
} from '@/lib/seotools/generators';

export default function SeoToolsPage() {
  const [activeTool, setActiveTool] = useState<string>('meta-title');

  // Tool 1: Meta Title
  const [titleKw, setTitleKw] = useState<string>('AI SaaS Copywriter');
  const titleResult = generateMetaTitle(titleKw);

  // Tool 2: Meta Description
  const [descKw, setDescKw] = useState<string>('Postgres visual ERD generator');
  const descResult = generateMetaDescription(descKw);

  // Tool 3: Robots.txt
  const [allowRobots, setAllowRobots] = useState<boolean>(true);
  const robotsTxt = generateRobotsTxt(allowRobots);

  // Tool 4: Slug Generator
  const [rawText, setRawText] = useState<string>('How to Launch Your SaaS Startup in 2026!');
  const generatedSlug = generateSlug(rawText);

  // Tool 5: FAQ Schema Generator
  const [q1, setQ1] = useState<string>('How does Toolverse help startup founders?');
  const [a1, setA1] = useState<string>('Toolverse provides a global startup directory, tool discovery engine, and ethical guest posting marketplace.');
  const faqSchema = generateFaqSchemaJsonLd([{ question: q1, answer: a1 }]);

  // Tool 6: Guest Post Pitch Generator
  const [targetPub, setTargetPub] = useState<string>('TechVision Journal');
  const [pitchTopic, setPitchTopic] = useState<string>('Scaling AI API Rate Limits in Node.js');
  const pitchTemplate = generateGuestPostPitchTemplate(targetPub, pitchTopic, 'Alex Rivera', 'Nexus AI');

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 shadow-2xl space-y-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          Free Privacy-First SEO Toolkit
        </span>
        <h1 className="text-3xl font-extrabold text-white">Ethical SEO Tools & Schema Generators</h1>
        <p className="text-slate-300 text-sm">
          Generate optimized meta title tags, descriptions, robots.txt files, JSON-LD schemas, and guest-post pitches. 100% free and client-side processing.
        </p>

        {/* Tool Selector Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {[
            { id: 'meta-title', name: 'Meta Title Tag Generator' },
            { id: 'meta-desc', name: 'Meta Description Generator' },
            { id: 'robots-txt', name: 'Robots.txt Generator' },
            { id: 'slug-gen', name: 'SEO Slug Generator' },
            { id: 'faq-schema', name: 'FAQ Schema (JSON-LD)' },
            { id: 'pitch-gen', name: 'Guest Post Pitch Generator' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTool === t.id ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tool Workplace */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        {activeTool === 'meta-title' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Meta Title Tag Generator</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Keyword / Topic</label>
                <input
                  type="text"
                  value={titleKw}
                  onChange={(e) => setTitleKw(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase block">Generated Title Tag Output:</span>
                <div className="text-lg font-bold text-indigo-400 font-mono">{titleResult.title}</div>
                
                <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Length: <span className="text-white font-bold">{titleResult.characterCount} chars</span> ({titleResult.pixelEstimateWidth}px)</span>
                  <span className={`font-bold ${titleResult.status === 'OPTIMAL' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {titleResult.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'meta-desc' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Meta Description Generator</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Topic</label>
                <input
                  type="text"
                  value={descKw}
                  onChange={(e) => setDescKw(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase block">Generated Description Output:</span>
                <p className="text-sm text-slate-200 leading-relaxed font-mono">{descResult.description}</p>
                
                <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Length: <span className="text-white font-bold">{descResult.characterCount} chars</span></span>
                  <span className={`font-bold ${descResult.status === 'OPTIMAL' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {descResult.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'robots-txt' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Robots.txt Generator</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowRobots}
                  onChange={(e) => setAllowRobots(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 bg-slate-950"
                />
                <span className="text-xs text-slate-200">Allow search engine crawlers to index site</span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                {robotsTxt}
              </pre>
            </div>
          </div>
        )}

        {activeTool === 'slug-gen' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">SEO Slug Generator</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
              />

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase block mb-1">Clean URL Slug:</span>
                <span className="text-base font-bold font-mono text-indigo-400">/startups/{generatedSlug}</span>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'faq-schema' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">FAQ Schema (JSON-LD) Generator</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                placeholder="Question"
                className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
              />
              <textarea
                rows={2}
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                placeholder="Answer"
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 text-xs"
              />

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                {JSON.stringify(faqSchema, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeTool === 'pitch-gen' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Guest Post Pitch Generator</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={targetPub}
                  onChange={(e) => setTargetPub(e.target.value)}
                  placeholder="Target Publisher"
                  className="bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                />
                <input
                  type="text"
                  value={pitchTopic}
                  onChange={(e) => setPitchTopic(e.target.value)}
                  placeholder="Topic Title"
                  className="bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap">
                {pitchTemplate}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
