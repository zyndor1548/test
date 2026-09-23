// itinerary.js — Left column: itinerary list, CRUD, selection, navigation.

// Track which itinerary item is currently selected
let selectedItineraryId = null;

/**
 * Render the full itinerary column.
 * @param {object} trip
 */
function renderItinerary(trip) {
  const col = document.getElementById('col-itinerary');
  if (!col) return;

  col.innerHTML = `
    <div class="col-header">
      <h2 class="col-title">Itinerary</h2>
      <div class="col-header-actions">
        <button class="btn btn--primary btn--sm" id="btn-add-itinerary">+ Add</button>
        <button class="btn btn--ghost btn--sm" id="btn-edit-itinerary" ${selectedItineraryId ? '' : 'disabled'}>Edit</button>
        <button class="btn btn--ghost btn--sm btn--danger" id="btn-delete-itinerary" ${selectedItineraryId ? '' : 'disabled'}>Delete</button>
      </div>
    </div>
    <div class="itinerary-list" id="itinerary-list">
      ${renderItineraryItems(trip)}
    </div>
  `;

  bindItineraryEvents(trip);
}

/**
 * Build the HTML for all itinerary items, grouped by day.
 */
function renderItineraryItems(trip) {
  if (trip.itinerary.length === 0) {
    return `
      <div class="empty-state empty-state--sm">
        <p class="empty-state__text">No itinerary yet.</p>
        <p class="empty-state__sub">Add occasions to plan your trip.</p>
      </div>
    `;
  }

  // Group by day (already sorted by data.js sortItinerary)
  const byDay = {};
  for (const item of trip.itinerary) {
    if (!byDay[item.day]) byDay[item.day] = [];
    byDay[item.day].push(item);
  }

  return Object.keys(byDay)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(day => {
      const items = byDay[day];
      return `
        <div class="itinerary-day-group">
          <div class="itinerary-day-label">Day ${day}</div>
          ${items.map(item => `
            <div class="itinerary-item ${selectedItineraryId === item.id ? 'itinerary-item--selected' : ''}"
                 data-id="${item.id}"
                 tabindex="0"
                 role="button"
                 aria-selected="${selectedItineraryId === item.id}">
              <span class="itinerary-item__time">${item.time}</span>
              <span class="itinerary-item__occasion">${escHtml(item.occasion)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
}

/**
 * Attach all event listeners for the itinerary column.
 */
function bindItineraryEvents(trip) {
  // Add button
  document.getElementById('btn-add-itinerary').addEventListener('click', () => {
    openAddItineraryModal(trip);
  });

  // Edit button
  const editBtn = document.getElementById('btn-edit-itinerary');
  editBtn.addEventListener('click', () => {
    if (!selectedItineraryId) return;
    const item = trip.itinerary.find(i => i.id === selectedItineraryId);
    if (item) openEditItineraryModal(trip, item);
  });

  // Delete button
  const deleteBtn = document.getElementById('btn-delete-itinerary');
  deleteBtn.addEventListener('click', () => {
    if (!selectedItineraryId) return;
    confirmDeleteItineraryItem(trip, selectedItineraryId);
  });

  // Itinerary items: single click = select, double click = scroll+highlight center
  const list = document.getElementById('itinerary-list');
  list.querySelectorAll('.itinerary-item').forEach(el => {
    el.addEventListener('click', () => {
      selectItineraryItem(el.dataset.id, trip);
    });

    el.addEventListener('dblclick', () => {
      scrollToOccasion(el.dataset.id);
    });

    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectItineraryItem(el.dataset.id, trip);
      }
    });
  });
}

/**
 * Select an itinerary item (single click).
 * Toggles selection off if clicking the already-selected item.
 */
function selectItineraryItem(id, trip) {
  if (selectedItineraryId === id) {
    selectedItineraryId = null;
  } else {
    selectedItineraryId = id;
  }
  renderItinerary(trip);
}

/**
 * Scroll the center column to the matching occasion and highlight it for 5s.
 */
function scrollToOccasion(itineraryId) {
  const card = document.querySelector(`[data-occasion-id="${itineraryId}"]`);
  if (!card) return;

  // Scroll center column
  const center = document.getElementById('col-outfits');
  if (center) {
    const cardTop = card.offsetTop - center.offsetTop;
    center.scrollTo({ top: cardTop - 20, behavior: 'smooth' });
  }

  // Apply highlight
  card.classList.add('occasion-highlight');

  // Remove after 5 seconds
  clearTimeout(card._highlightTimer);
  card._highlightTimer = setTimeout(() => {
    card.classList.remove('occasion-highlight');
  }, 5000);
}

// ── Modals ────────────────────────────────────────────────────────────────────

/**
 * Build the day options for the itinerary form.
 * Shows days 1–30; if there are existing days, ensures they all appear.
 */
function buildDayOptions(trip, selectedDay) {
  const existingDays = trip.itinerary.map(i => i.day);
  const maxDay = Math.max(30, ...existingDays, 1);
  let html = '';
  for (let d = 1; d <= maxDay; d++) {
    html += `<option value="${d}" ${parseInt(selectedDay) === d ? 'selected' : ''}>Day ${d}</option>`;
  }
  return html;
}

function openAddItineraryModal(trip) {
  openModal({
    title: 'Add Itinerary',
    body: `
      <div class="form-group">
        <label class="form-label" for="itin-day">Day</label>
        <select class="form-select" id="itin-day">
          ${buildDayOptions(trip, 1)}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="itin-time">Time</label>
        <input class="form-input" id="itin-time" type="time" value="08:00" />
      </div>
      <div class="form-group">
        <label class="form-label" for="itin-occasion">Occasion</label>
        <input class="form-input" id="itin-occasion" type="text" placeholder="e.g. Breakfast" maxlength="80" autocomplete="off" />
      </div>
    `,
    primaryLabel: 'Add',
    onPrimary: () => {
      const day = document.getElementById('itin-day').value;
      const time = document.getElementById('itin-time').value;
      const occasion = document.getElementById('itin-occasion').value.trim();
      if (!occasion) { shakeInput('itin-occasion'); return false; }
      addItineraryItem(trip, day, time, occasion);
      saveState(state);
      renderAll();
      return true;
    },
    onOpen: () => {
      document.getElementById('itin-occasion').focus();
    }
  });
}

function openEditItineraryModal(trip, item) {
  openModal({
    title: 'Edit Itinerary',
    body: `
      <div class="form-group">
        <label class="form-label" for="edit-itin-day">Day</label>
        <select class="form-select" id="edit-itin-day">
          ${buildDayOptions(trip, item.day)}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="edit-itin-time">Time</label>
        <input class="form-input" id="edit-itin-time" type="time" value="${item.time}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="edit-itin-occasion">Occasion</label>
        <input class="form-input" id="edit-itin-occasion" type="text" value="${escHtml(item.occasion)}" maxlength="80" autocomplete="off" />
      </div>
    `,
    primaryLabel: 'Save',
    onPrimary: () => {
      const day = document.getElementById('edit-itin-day').value;
      const time = document.getElementById('edit-itin-time').value;
      const occasion = document.getElementById('edit-itin-occasion').value.trim();
      if (!occasion) { shakeInput('edit-itin-occasion'); return false; }
      editItineraryItem(trip, item.id, day, time, occasion);
      saveState(state);
      renderAll();
      return true;
    },
    onOpen: () => {
      const inp = document.getElementById('edit-itin-occasion');
      inp.focus();
      inp.select();
    }
  });
}

function confirmDeleteItineraryItem(trip, itemId) {
  const item = trip.itinerary.find(i => i.id === itemId);
  if (!item) return;

  openModal({
    title: 'Delete Occasion',
    body: `<p class="modal-confirm-text">Delete <strong>Day ${item.day} · ${item.time} — ${escHtml(item.occasion)}</strong>? Any clothing assigned to this occasion will be returned to the closet.</p>`,
    primaryLabel: 'Delete',
    primaryDanger: true,
    onPrimary: () => {
      deleteItineraryItem(trip, itemId);
      if (selectedItineraryId === itemId) selectedItineraryId = null;
      saveState(state);
      renderAll();
      return true;
    }
  });
}
