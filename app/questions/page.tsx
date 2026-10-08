import React, { useState } from 'react';
import { getStoredQuestions, saveQuestion } from '@/lib/products/storageEngine';
import { Question } from '@/lib/products/types';
import { PRODUCT_CATEGORIES } from '@/lib/products/registry';
import { MessageSquare, ThumbsUp, Plus, Sparkles, X } from 'lucide-react';

export default function QuestionsHubPage() {
  const [questions, setQuestions] = useState<Question[]>(getStoredQuestions());
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('productivity');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTags, setNewTags] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArr = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const created = saveQuestion(newTitle, newContent, newCategory, newAuthor, tagsArr);
    setQuestions([created, ...questions]);
    setShowAskModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="p-8 sm:p-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Community Q&amp;A Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Ask Software &amp; Utility Questions</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Get practical advice on software alternatives, AI prompts, developer utilities, and workflow automation.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Ask a Question
        </button>
      </header>

      {/* Questions List */}
      <section className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl shadow-sm transition-all space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{q.categoryName}</span>
              <span>Asked by {q.authorName} &bull; {q.date}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
              <a href={`/questions/${q.slug}`}>{q.title}</a>
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{q.content}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {q.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[11px]">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-slate-500 font-semibold">
                <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {q.upvotes} Upvotes</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> {q.answersCount} Answers</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Ask Community Question</h3>
              <button onClick={() => setShowAskModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Question Title</label>
                <input
                  type="text"
                  placeholder="e.g. What is the best free alternative to Photoshop online?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Details &amp; Context</label>
                <textarea
                  rows={3}
                  placeholder="Describe your use case, file constraints, or feature requirements..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="photoshop, free-tools, canva"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
