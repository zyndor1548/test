// home.js — Home page rendering and trip management interactions.

/**
 * Render the home page into #page-home.
 * Reads from global `state` and writes back via data.js functions.
 */
function renderHome() {
  const page = document.getElementById('page-home');
  page.innerHTML = `
    <header class="home-header">
      <div class="home-logo">
        <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18 L0 28 L10 32 L10 56 L50 56 L50 32 L60 28 L50 18 L38 10 Q30 16 22 10 Z" fill="#7C3AED" stroke="#5b21b6" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <span class="home-logo-text">Cloth Itinerary</span>
      </div>
    </header>

    <main class="home-main">
      <div class="home-hero">
        <h1 class="home-title">Your Trips</h1>
        <p class="home-subtitle">Plan what to wear for every occasion.</p>
      </div>

      <div id="trips-grid" class="trips-grid"></div>

      <div class="home-actions">
        <button class="btn btn--primary btn--lg home-new-btn" id="btn-new-trip">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Trip
        </button>
        <button class="btn btn--ghost btn--lg" id="btn-import-trips">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Import
        </button>
        <button class="btn btn--ghost btn--lg" id="btn-export-trips">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Export
        </button>
        <input type="file" id="import-file-input" accept=".json" hidden />
      </div>
    </main>
  `;

  renderTripCards();

  document.getElementById('btn-new-trip').addEventListener('click', () => openNewTripModal());
  document.getElementById('btn-import-trips').addEventListener('click', () => {
    const fileInput = document.getElementById('import-file-input');
    fileInput.value = '';
    fileInput.click();
  });
  document.getElementById('btn-export-trips').addEventListener('click', () => exportAllTrips());

  document.getElementById('import-file-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      handleImportFileSelect(file);
    }
  });
}

/**
 * Render the trip card grid.
 */
function renderTripCards() {
  const grid = document.getElementById('trips-grid');
  if (!grid) return;

  if (state.trips.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="56" height="56" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18 L0 28 L10 32 L10 56 L50 56 L50 32 L60 28 L50 18 L38 10 Q30 16 22 10 Z" fill="#e9d5ff" stroke="#c4b5fd" stroke-width="2"/>
          </svg>
        </div>
        <p class="empty-state__text">No trips yet.</p>
        <p class="empty-state__sub">Plan your first trip.</p>
        <button class="btn btn--primary" id="btn-empty-new-trip">+ Create Trip</button>
      </div>
    `;
    document.getElementById('btn-empty-new-trip').addEventListener('click', () => openNewTripModal());
    return;
  }

  grid.innerHTML = state.trips.map(trip => {
    const dayCount = trip.itinerary.length > 0
      ? Math.max(...trip.itinerary.map(i => i.day))
      : 0;
    const clothingCount = trip.clothing.length;
    return `
      <div class="trip-card" data-trip-id="${trip.id}">
        <div class="trip-card__body">
          <h2 class="trip-card__name">${escHtml(trip.name)}</h2>
          <div class="trip-card__meta">
            <span>${dayCount > 0 ? dayCount + ' day' + (dayCount !== 1 ? 's' : '') : 'No days yet'}</span>
            <span class="trip-card__dot">·</span>
            <span>${clothingCount} item${clothingCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="trip-card__actions">
          <button class="btn btn--primary btn--sm trip-open-btn" data-trip-id="${trip.id}">Open</button>
          <button class="btn btn--ghost btn--sm trip-duplicate-btn" data-trip-id="${trip.id}">Duplicate</button>
          <button class="btn btn--ghost btn--icon trip-rename-btn" data-trip-id="${trip.id}" title="Rename trip">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn btn--ghost btn--icon btn--danger trip-delete-btn" data-trip-id="${trip.id}" title="Delete trip">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Open
  grid.querySelectorAll('.trip-open-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.tripId;
      openTrip(id);
    });
  });

  // Duplicate
  grid.querySelectorAll('.trip-duplicate-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.tripId;
      const duplicated = duplicateTrip(state, id);
      if (duplicated) {
        saveState(state);
        renderTripCards();
        showToast('Trip duplicated successfully.', 'success');
      }
    });
  });

  // Rename
  grid.querySelectorAll('.trip-rename-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openRenameTripModal(btn.dataset.tripId);
    });
  });

  // Delete
  grid.querySelectorAll('.trip-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      confirmDeleteTrip(btn.dataset.tripId);
    });
  });

  // Click card body → open
  grid.querySelectorAll('.trip-card').forEach(card => {
    card.addEventListener('click', () => openTrip(card.dataset.tripId));
  });
}

// ── Modals ────────────────────────────────────────────────────────────────────

function openNewTripModal() {
  openModal({
    title: 'Create Trip',
    body: `
      <div class="form-group">
        <label class="form-label" for="trip-name-input">Trip name</label>
        <input class="form-input" id="trip-name-input" type="text" placeholder="e.g. Kerala Trip" maxlength="80" autocomplete="off" />
      </div>
    `,
    primaryLabel: 'Create',
    onPrimary: () => {
      const name = document.getElementById('trip-name-input').value.trim();
      if (!name) {
        shakeInput('trip-name-input');
        return false; // keep modal open
      }
      createTrip(state, name);
      saveState(state);
      // Open the new trip immediately
      openTrip(state.currentTripId);
      return true; // close modal
    },
    onOpen: () => {
      const inp = document.getElementById('trip-name-input');
      inp.focus();
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          document.getElementById('modal-primary-btn').click();
        }
      });
    }
  });
}

function openRenameTripModal(tripId) {
  const trip = getTripById(state, tripId);
  if (!trip) return;

  openModal({
    title: 'Rename Trip',
    body: `
      <div class="form-group">
        <label class="form-label" for="rename-trip-input">Trip name</label>
        <input class="form-input" id="rename-trip-input" type="text" value="${escHtml(trip.name)}" maxlength="80" autocomplete="off" />
      </div>
    `,
    primaryLabel: 'Save',
    onPrimary: () => {
      const name = document.getElementById('rename-trip-input').value.trim();
      if (!name) { shakeInput('rename-trip-input'); return false; }
      renameTrip(state, tripId, name);
      saveState(state);
      renderTripCards();
      return true;
    },
    onOpen: () => {
      const inp = document.getElementById('rename-trip-input');
      inp.focus();
      inp.select();
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('modal-primary-btn').click();
      });
    }
  });
}

function confirmDeleteTrip(tripId) {
  const trip = getTripById(state, tripId);
  if (!trip) return;

  openModal({
    title: 'Delete Trip',
    body: `<p class="modal-confirm-text">Are you sure you want to delete <strong>${escHtml(trip.name)}</strong>? All itinerary and clothing data for this trip will be permanently deleted.</p>`,
    primaryLabel: 'Delete',
    primaryDanger: true,
    onPrimary: () => {
      deleteTrip(state, tripId);
      saveState(state);
      renderTripCards();
      return true;
    }
  });
}

// ── Export & Import Operations ────────────────────────────────────────────────

function exportAllTrips() {
  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    trips: state.trips
  };
  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cloth-itinerary-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleImportFileSelect(file) {
  const reader = new FileReader();
  reader.onload = e => {
    let parsed = null;
    try {
      parsed = JSON.parse(e.target.result);
    } catch (err) {
      showInvalidImportModal();
      return;
    }

    const validation = validateBackupData(parsed);
    if (!validation.valid) {
      showInvalidImportModal();
      return;
    }

    openModal({
      title: 'Import Trips',
      body: `
        <p class="modal-confirm-text">This backup contains:</p>
        <ul class="import-summary-list">
          <li><strong>${validation.tripCount}</strong> trip${validation.tripCount !== 1 ? 's' : ''}</li>
          <li><strong>${validation.itinCount}</strong> itinerary item${validation.itinCount !== 1 ? 's' : ''}</li>
          <li><strong>${validation.clothingCount}</strong> clothing item${validation.clothingCount !== 1 ? 's' : ''}</li>
        </ul>
        <p class="modal-confirm-text">Import these trips?</p>
      `,
      primaryLabel: 'Import',
      onPrimary: () => {
        const imported = importTrips(state, validation.rawTrips);
        saveState(state);
        renderTripCards();
        const count = imported.length;
        showToast(`${count} trip${count !== 1 ? 's' : ''} imported successfully.`, 'success');
        return true;
      }
    });
  };
  reader.readAsText(file);
}

function showInvalidImportModal() {
  openModal({
    title: 'Import Failed',
    body: `
      <p class="modal-confirm-text" style="font-weight: 600; color: var(--danger);">Invalid backup file.</p>
      <p class="modal-confirm-text" style="margin-top: 8px;">No changes were made to your trips.</p>
    `,
    primaryLabel: null
  });
}

/**
 * Navigate to the trip planner page for the given tripId.
 */
function openTrip(tripId) {
  state.currentTripId = tripId;
  saveState(state);
  showTripPage();
}

