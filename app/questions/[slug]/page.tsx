import React, { useState } from 'react';
import { getQuestionBySlug } from '@/lib/products/questionsRegistry';
import { getStoredQuestions, saveAnswer } from '@/lib/products/storageEngine';
import { PRODUCTS } from '@/lib/products/registry';
import { TOOLS } from '@/lib/tools/registry';
import { ThumbsUp, CheckCircle, MessageSquare, ExternalLink, Sparkles, Send } from 'lucide-react';

interface QuestionDetailPageProps {
  params: { slug: string };
}

export default function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const allQs = getStoredQuestions();
  const question = allQs.find((q) => q.slug === params.slug) || getQuestionBySlug(params.slug);

  const [answers, setAnswers] = useState(question?.answers || []);
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorTitle, setNewAuthorTitle] = useState('');

  if (!question) {
    return (
      <div className="p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Question Not Found</h1>
        <p className="text-slate-500 text-sm">The question you are looking for does not exist.</p>
        <a href="/questions" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Back to Questions Hub
        </a>
      </div>
    );
  }

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerContent.trim()) return;

    const ans = saveAnswer(question.slug, newAnswerContent, newAuthorName, newAuthorTitle);
    if (ans) {
      setAnswers([...answers, ans]);
      setNewAnswerContent('');
    }
  };

  return (
    <article className="space-y-8 max-w-4xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <a href="/" className="hover:underline">Home</a> &gt;
        <a href="/questions" className="hover:underline">Questions</a> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold line-clamp-1">{question.title}</span>
      </nav>

      {/* Main Question Post */}
      <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{question.categoryName}</span>
          <span>Asked on {question.date} by <strong>{question.authorName}</strong></span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">{question.title}</h1>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{question.content}</p>

        <div className="flex flex-wrap gap-2 pt-2 text-xs">
          {question.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* Answers List */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" /> Community Answers ({answers.length})
        </h2>

        <div className="space-y-4">
          {answers.map((ans) => (
            <div
              key={ans.id}
              className={`p-6 rounded-2xl border space-y-3 ${
                ans.isAccepted
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{ans.authorName}</span>
                  {ans.authorTitle && (
                    <span className="text-[11px] text-slate-500 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                      {ans.authorTitle}
                    </span>
                  )}
                  {ans.isAccepted && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px]">
                      <CheckCircle className="w-3 h-3" /> Accepted Solution
                    </span>
                  )}
                </div>
                <span className="text-slate-400">{ans.date}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{ans.content}</p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <button className="flex items-center gap-1 text-slate-500 font-semibold hover:text-indigo-600">
                  <ThumbsUp className="w-3.5 h-3.5" /> {ans.upvotes} Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Answer Submission Form */}
      <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Post Your Answer</h3>
        <form onSubmit={handleAnswerSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. David Chen"
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Expertise / Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={newAuthorTitle}
                onChange={(e) => setNewAuthorTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Solution / Answer</label>
            <textarea
              rows={4}
              placeholder="Provide a helpful, detailed answer with tool recommendations and practical tips..."
              value={newAnswerContent}
              onChange={(e) => setNewAnswerContent(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
            ></textarea>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition-all"
          >
            <Send className="w-4 h-4" /> Submit Answer
          </button>
        </form>
      </section>
    </article>
  );
}
