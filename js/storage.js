// storage.js — localStorage read/write helpers

const STORAGE_KEY = 'cloth_itinerary_v1';

/**
 * Load the full application state from localStorage.
 * Returns a default state if nothing is stored yet.
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored state:', e);
  }
  return getDefaultState();
}

/**
 * Persist the full application state to localStorage.
 * @param {object} state
 */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

/**
 * Returns the initial empty state structure.
 */
function getDefaultState() {
  return {
    trips: [],
    currentTripId: null
  };
}
