import { TravelPlan } from './types';

const SAVED_CHECKLISTS_KEY = 'toolverse_travel_checklists';
const SAVED_TRIPS_KEY = 'toolverse_saved_trips';

export function saveTripPlan(plan: TravelPlan) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY);
    const list: TravelPlan[] = raw ? JSON.parse(raw) : [];
    list.unshift(plan);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save trip plan:', e);
  }
}

export function saveTravelPlanToStorage(plan: TravelPlan) {
  saveTripPlan(plan);
}

export function getSavedTripPlans(): TravelPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSavedTravelPlans(): TravelPlan[] {
  return getSavedTripPlans();
}
