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
      color,
      isAvailable: true
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
 * Footwear remains available in Closet. Non-footwear becomes unavailable in Closet until washed.
 */
function assignClothing(trip, clothingId, itineraryId) {
  if (!trip.assignments[itineraryId]) {
    trip.assignments[itineraryId] = [];
  }
  if (!trip.assignments[itineraryId].includes(clothingId)) {
    trip.assignments[itineraryId].push(clothingId);
  }

  const item = getClothingById(trip, clothingId);
  if (item && item.category !== 'footwear') {
    item.isAvailable = false;
  }
}

/**
 * Unassign a clothing item from a specific occasion.
 * Restores availability in Closet for non-footwear items.
 */
function unassignClothing(trip, clothingId, itineraryId) {
  if (itineraryId && trip.assignments[itineraryId]) {
    const idx = trip.assignments[itineraryId].indexOf(clothingId);
    if (idx !== -1) {
      trip.assignments[itineraryId].splice(idx, 1);
    }
  } else {
    // Legacy fallback: remove from all assignments
    for (const itinId of Object.keys(trip.assignments)) {
      const arr = trip.assignments[itinId];
      const idx = arr.indexOf(clothingId);
      if (idx !== -1) arr.splice(idx, 1);
    }
  }

  const item = getClothingById(trip, clothingId);
  if (item) {
    item.isAvailable = true;
  }
  return true;
}

/**
 * Move a clothing item from one occasion to another.
 * Removes assignment from source occasion and assigns to target occasion.
 */
function moveClothing(trip, clothingId, fromItineraryId, toItineraryId) {
  if (fromItineraryId && trip.assignments[fromItineraryId]) {
    const idx = trip.assignments[fromItineraryId].indexOf(clothingId);
    if (idx !== -1) {
      trip.assignments[fromItineraryId].splice(idx, 1);
    }
  }
  if (!trip.assignments[toItineraryId]) {
    trip.assignments[toItineraryId] = [];
  }
  if (!trip.assignments[toItineraryId].includes(clothingId)) {
    trip.assignments[toItineraryId].push(clothingId);
  }
}

/**
 * "Wash" — mark clothing as clean/available for reuse in the Closet
 * while keeping the existing center-column occasion assignment intact.
 */
function washClothing(trip, clothingId) {
  const item = getClothingById(trip, clothingId);
  if (item) {
    item.isAvailable = true;
  }
  return true;
}

/**
 * Get all clothing ids assigned to a specific itinerary item.
 */
function getAssignedClothing(trip, itineraryId) {
  return trip.assignments[itineraryId] || [];
}

/**
 * Get all clothing objects currently available in the Closet.
 * Footwear is ALWAYS available. Non-footwear is available when isAvailable === true.
 */
function getAvailableClothing(trip) {
  return trip.clothing.filter(c => {
    if (c.category === 'footwear') return true;
    if (c.isAvailable !== undefined) return c.isAvailable;
    const assignedSet = new Set(Object.values(trip.assignments).flat());
    return !assignedSet.has(c.id);
  });
}


/**
 * Get clothing object by id.
 */
function getClothingById(trip, clothingId) {
  return trip.clothing.find(c => c.id === clothingId) || null;
}

// ─── Duplication & Import/Export Data Operations ─────────────────────────────

/**
 * Duplicate a trip: copies itinerary only, empty closet and assignments.
 * Generates unique non-conflicting trip name and unique item IDs.
 */
function duplicateTrip(state, tripId) {
  const source = getTripById(state, tripId);
  if (!source) return null;

  // Generate unique name: "Kerala Trip Copy", "Kerala Trip Copy 2", etc.
  let newName = `${source.name} Copy`;
  const existingNames = new Set(state.trips.map(t => t.name));
  if (existingNames.has(newName)) {
    let count = 2;
    while (existingNames.has(`${source.name} Copy ${count}`)) {
      count++;
    }
    newName = `${source.name} Copy ${count}`;
  }

  // Copy itinerary with new unique IDs
  const newItinerary = (source.itinerary || []).map(item => ({
    id: genId(),
    day: item.day,
    time: item.time,
    occasion: item.occasion
  }));

  const newTrip = {
    id: genId(),
    name: newName,
    itinerary: newItinerary,
    clothing: [],
    assignments: {}
  };

  state.trips.push(newTrip);
  return newTrip;
}

/**
 * Validate backup JSON data format.
 * Returns { valid: true/false, rawTrips: [...], tripCount, itinCount, clothingCount }
 */
function validateBackupData(parsedData) {
  if (!parsedData || typeof parsedData !== 'object') {
    return { valid: false };
  }

  let rawTrips = null;
  if (Array.isArray(parsedData)) {
    rawTrips = parsedData;
  } else if (Array.isArray(parsedData.trips)) {
    rawTrips = parsedData.trips;
  } else {
    return { valid: false };
  }

  let itinCount = 0;
  let clothingCount = 0;

  for (const trip of rawTrips) {
    if (!trip || typeof trip !== 'object') return { valid: false };
    if (typeof trip.name !== 'string' || !trip.name.trim()) return { valid: false };

    if (trip.itinerary !== undefined && !Array.isArray(trip.itinerary)) return { valid: false };
    const itinerary = trip.itinerary || [];
    for (const itin of itinerary) {
      if (!itin || typeof itin !== 'object') return { valid: false };
      if (typeof itin.day !== 'number' && isNaN(parseInt(itin.day, 10))) return { valid: false };
      if (typeof itin.time !== 'string' || typeof itin.occasion !== 'string') return { valid: false };
    }
    itinCount += itinerary.length;

    if (trip.clothing !== undefined && !Array.isArray(trip.clothing)) return { valid: false };
    const clothing = trip.clothing || [];
    for (const c of clothing) {
      if (!c || typeof c !== 'object') return { valid: false };
      if (typeof c.name !== 'string' || typeof c.category !== 'string') return { valid: false };
    }
    clothingCount += clothing.length;

    if (trip.assignments !== undefined && (typeof trip.assignments !== 'object' || trip.assignments === null || Array.isArray(trip.assignments))) {
      return { valid: false };
    }
  }

  return {
    valid: true,
    rawTrips,
    tripCount: rawTrips.length,
    itinCount,
    clothingCount
  };
}

/**
 * Import trips into state with collision safety.
 * Re-maps trip IDs, itinerary item IDs, clothing instance IDs, and assignments.
 */
function importTrips(state, rawTrips) {
  const importedTrips = [];
  const existingNames = new Set(state.trips.map(t => t.name));

  for (const rawTrip of rawTrips) {
    let name = rawTrip.name.trim();
    if (existingNames.has(name)) {
      let candidate = `${name} (Imported)`;
      let count = 2;
      while (existingNames.has(candidate)) {
        candidate = `${name} (Imported ${count})`;
        count++;
      }
      name = candidate;
    }
    existingNames.add(name);

    const itinIdMap = {};
    const clothingIdMap = {};

    const newItinerary = (rawTrip.itinerary || []).map(item => {
      const newId = genId();
      if (item.id) itinIdMap[item.id] = newId;
      return {
        id: newId,
        day: parseInt(item.day, 10) || 1,
        time: item.time || '08:00',
        occasion: (item.occasion || '').trim()
      };
    });

    const newClothing = (rawTrip.clothing || []).map(c => {
      const newId = genId();
      if (c.id) clothingIdMap[c.id] = newId;
      return {
        id: newId,
        name: (c.name || '').trim(),
        category: c.category || 'tops',
        type: c.type || 'shirt',
        color: c.color || '#000000',
        isAvailable: c.isAvailable !== undefined ? c.isAvailable : true
      };
    });


    const newAssignments = {};
    if (rawTrip.assignments && typeof rawTrip.assignments === 'object') {
      for (const [oldItinId, oldClothingIds] of Object.entries(rawTrip.assignments)) {
        const targetItinId = itinIdMap[oldItinId];
        if (targetItinId && Array.isArray(oldClothingIds)) {
          const mappedClothingIds = oldClothingIds
            .map(oldCId => clothingIdMap[oldCId])
            .filter(Boolean);
          if (mappedClothingIds.length > 0) {
            newAssignments[targetItinId] = mappedClothingIds;
          }
        }
      }
    }

    const newTrip = {
      id: genId(),
      name,
      itinerary: newItinerary,
      clothing: newClothing,
      assignments: newAssignments
    };

    sortItinerary(newTrip);
    state.trips.push(newTrip);
    importedTrips.push(newTrip);
  }

  return importedTrips;
}

