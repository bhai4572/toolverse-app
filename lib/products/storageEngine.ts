import { Product, ProductReview, Question, Answer, Collection, ProductSubmission } from './types';
import { PRODUCTS } from './registry';
import { QUESTIONS } from './questionsRegistry';
import { COLLECTIONS } from './collectionsRegistry';

const SUBMISSIONS_KEY = 'toolverse_submitted_products';
const REVIEWS_KEY = 'toolverse_product_reviews';
const USER_QUESTIONS_KEY = 'toolverse_user_questions';
const USER_ANSWERS_KEY = 'toolverse_user_answers';
const USER_COLLECTIONS_KEY = 'toolverse_user_collections';
const UPVOTES_KEY = 'toolverse_user_upvotes';

// --- Submissions ---
export function getStoredSubmissions(): ProductSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(submission: Omit<ProductSubmission, 'id' | 'submittedAt' | 'status'>): ProductSubmission {
  const newSub: ProductSubmission = {
    ...submission,
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString().split('T')[0],
    status: 'pending',
  };
  const list = getStoredSubmissions();
  list.unshift(newSub);
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  }
  return newSub;
}

// --- Reviews ---
export function getStoredReviews(productSlug: string): ProductReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const all: ProductReview[] = raw ? JSON.parse(raw) : [];
    return all.filter((r) => r.productSlug === productSlug);
  } catch {
    return [];
  }
}

export function saveReview(review: Omit<ProductReview, 'id' | 'date' | 'upvotes' | 'isVerifiedUser'>): ProductReview {
  const newRev: ProductReview = {
    ...review,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    upvotes: 1,
    isVerifiedUser: true,
  };
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const all: ProductReview[] = raw ? JSON.parse(raw) : [];
    all.unshift(newRev);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  }
  return newRev;
}

// --- Questions ---
export function getStoredQuestions(): Question[] {
  if (typeof window === 'undefined') return QUESTIONS;
  try {
    const raw = localStorage.getItem(USER_QUESTIONS_KEY);
    const userQs: Question[] = raw ? JSON.parse(raw) : [];
    return [...userQs, ...QUESTIONS];
  } catch {
    return QUESTIONS;
  }
}

export function saveQuestion(title: string, content: string, categorySlug: string, authorName: string, tags: string[]): Question {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const newQ: Question = {
    id: `q-${Date.now()}`,
    slug,
    title,
    content,
    authorId: `u-${Date.now()}`,
    authorName: authorName || 'Anonymous Community Member',
    categorySlug,
    categoryName: categorySlug.replace(/-/g, ' ').toUpperCase(),
    date: new Date().toISOString().split('T')[0],
    upvotes: 1,
    views: 1,
    answersCount: 0,
    answers: [],
    tags,
  };

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(USER_QUESTIONS_KEY);
    const userQs: Question[] = raw ? JSON.parse(raw) : [];
    userQs.unshift(newQ);
    localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(userQs));
  }
  return newQ;
}

export function saveAnswer(questionSlug: string, content: string, authorName: string, authorTitle?: string): Answer | null {
  const allQs = getStoredQuestions();
  const q = allQs.find((item) => item.slug === questionSlug);
  if (!q) return null;

  const newAns: Answer = {
    id: `ans-${Date.now()}`,
    questionId: q.id,
    authorId: `u-${Date.now()}`,
    authorName: authorName || 'Community Specialist',
    authorTitle: authorTitle || 'Verified Contributor',
    content,
    date: new Date().toISOString().split('T')[0],
    upvotes: 1,
    isAccepted: false,
  };

  q.answers.push(newAns);
  q.answersCount = q.answers.length;

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(USER_QUESTIONS_KEY);
    const userQs: Question[] = raw ? JSON.parse(raw) : [];
    const idx = userQs.findIndex((item) => item.slug === questionSlug);
    if (idx !== -1) {
      userQs[idx] = q;
      localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(userQs));
    }
  }
  return newAns;
}

// --- Upvotes ---
export function toggleUpvote(id: string): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(UPVOTES_KEY);
  const votes: Record<string, boolean> = raw ? JSON.parse(raw) : {};
  const currentState = !!votes[id];
  votes[id] = !currentState;
  localStorage.setItem(UPVOTES_KEY, JSON.stringify(votes));
  return !currentState;
}

export function isUpvoted(id: string): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(UPVOTES_KEY);
  const votes: Record<string, boolean> = raw ? JSON.parse(raw) : {};
  return !!votes[id];
}
