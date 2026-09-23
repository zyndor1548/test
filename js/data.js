// data.js — Pure data operations on state. No DOM access here.

// ─── UUID helper ─────────────────────────────────────────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Trip CRUD ────────────────────────────────────────────────────────────────

/**
 * Create a new trip and append it to state.trips.
 * Returns the new trip object.
 */
function createTrip(state, name) {
  const trip = {
    id: genId(),
    name: name.trim(),
    itinerary: [],
    clothing: [],
    assignments: {}   // { itineraryId: [clothingId, ...] }
  };
  state.trips.push(trip);
  state.currentTripId = trip.id;
  return trip;
}

/**
 * Rename a trip by id. Returns true on success.
 */
function renameTrip(state, tripId, newName) {
  const trip = getTripById(state, tripId);
  if (!trip) return false;
  trip.name = newName.trim();
  return true;
}

/**
 * Delete a trip and all its data. Returns true on success.
 */
function deleteTrip(state, tripId) {
  const idx = state.trips.findIndex(t => t.id === tripId);
  if (idx === -1) return false;
  state.trips.splice(idx, 1);
  if (state.currentTripId === tripId) {
    state.currentTripId = null;
  }
  return true;
}

/**
 * Get a trip by id.
 */
function getTripById(state, tripId) {
  return state.trips.find(t => t.id === tripId) || null;
}

/**
 * Get the currently active trip, or null.
 */
function getCurrentTrip(state) {
  if (!state.currentTripId) return null;
  return getTripById(state, state.currentTripId);
}

// ─── Itinerary CRUD ───────────────────────────────────────────────────────────

/**
 * Add an itinerary item. Returns the new item.
 * @param {object} trip
 * @param {number} day   e.g. 1
 * @param {string} time  e.g. "08:00"
 * @param {string} occasion  e.g. "Breakfast"
 */
function addItineraryItem(trip, day, time, occasion) {
  const item = {
    id: genId(),
    day: parseInt(day, 10),
    time,
    occasion: occasion.trim()
  };
  trip.itinerary.push(item);
  sortItinerary(trip);
  return item;
}

/**
 * Edit an itinerary item in-place. Re-sorts after edit.
 */
function editItineraryItem(trip, itemId, day, time, occasion) {
  const item = trip.itinerary.find(i => i.id === itemId);
  if (!item) return false;
  item.day = parseInt(day, 10);
  item.time = time;
  item.occasion = occasion.trim();
  sortItinerary(trip);
  return true;
}

/**
 * Delete an itinerary item and remove all its assignments.
 */
function deleteItineraryItem(trip, itemId) {
  const idx = trip.itinerary.findIndex(i => i.id === itemId);
  if (idx === -1) return false;
  trip.itinerary.splice(idx, 1);
  delete trip.assignments[itemId];
  return true;
}

/**
 * Sort itinerary by day, then by time string (lexicographic HH:MM works fine).
 */
function sortItinerary(trip) {
  trip.itinerary.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.time.localeCompare(b.time);
  });
}

// ─── Clothing CRUD ────────────────────────────────────────────────────────────

/**
 * Add clothing. 'quantity' creates that many individual instances.
 * Each instance has a unique id but same name/category/type/color.
 * Returns array of created instances.
 */
function addClothing(trip, { name, category, type, color, quantity = 1 }) {
  const instances = [];
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  for (let i = 0; i < qty; i++) {
    const item = {
      id: genId(),
      name: name.trim(),
      category,
      type,
      color
    };
    trip.clothing.push(item);
    instances.push(item);
  }
  return instances;
}

/**
 * Edit a clothing instance. If it's assigned, the assignment still points to
 * the same id — only the display data changes.
 */
function editClothing(trip, clothingId, { name, category, type, color }) {
  const item = trip.clothing.find(c => c.id === clothingId);
  if (!item) return false;
  item.name = name.trim();
  item.category = category;
  item.type = type;
  item.color = color;
  return true;
}

/**
 * Delete a clothing instance. Also removes it from any occasion it's assigned to.
 */
function deleteClothing(trip, clothingId) {
  const idx = trip.clothing.findIndex(c => c.id === clothingId);
  if (idx === -1) return false;
  trip.clothing.splice(idx, 1);
  // Remove from all assignments
  for (const itinId of Object.keys(trip.assignments)) {
    const arr = trip.assignments[itinId];
    const cidx = arr.indexOf(clothingId);
    if (cidx !== -1) arr.splice(cidx, 1);
  }
  return true;
}

// ─── Assignment operations ────────────────────────────────────────────────────

/**
 * Get the occasion id that a clothing item is currently assigned to, or null.
 */
function getClothingAssignedTo(trip, clothingId) {
  for (const [itinId, ids] of Object.entries(trip.assignments)) {
    if (ids.includes(clothingId)) return itinId;
  }
  return null;
}

/**
 * Assign a clothing item to an itinerary occasion.
 * Removes from any previous assignment first.
 */
function assignClothing(trip, clothingId, itineraryId) {
  // Remove from any current assignment
  unassignClothing(trip, clothingId);
  if (!trip.assignments[itineraryId]) {
    trip.assignments[itineraryId] = [];
  }
  if (!trip.assignments[itineraryId].includes(clothingId)) {
    trip.assignments[itineraryId].push(clothingId);
  }
}

/**
 * Unassign a clothing item from wherever it currently is.
 * Returns it to the closet (available state).
 */
function unassignClothing(trip, clothingId) {
  for (const itinId of Object.keys(trip.assignments)) {
    const arr = trip.assignments[itinId];
    const idx = arr.indexOf(clothingId);
    if (idx !== -1) {
      arr.splice(idx, 1);
      return itinId; // return where it was
    }
  }
  return null;
}

/**
 * Move a clothing item from one occasion to another.
 * Equivalent to unassign + assign.
 */
function moveClothing(trip, clothingId, targetItineraryId) {
  assignClothing(trip, clothingId, targetItineraryId);
}

/**
 * "Wash" — remove clothing from an occasion, return to closet.
 * Alias for unassignClothing, kept semantically named.
 */
function washClothing(trip, clothingId) {
  return unassignClothing(trip, clothingId);
}

/**
 * Get all clothing ids assigned to a specific itinerary item.
 */
function getAssignedClothing(trip, itineraryId) {
  return trip.assignments[itineraryId] || [];
}

/**
 * Get all clothing ids that are NOT assigned to any occasion.
 */
function getAvailableClothing(trip) {
  const allAssigned = new Set(Object.values(trip.assignments).flat());
  return trip.clothing.filter(c => !allAssigned.has(c.id));
}

/**
 * Get clothing object by id.
 */
function getClothingById(trip, clothingId) {
  return trip.clothing.find(c => c.id === clothingId) || null;
}
