// app.js — Bootstrap, router, shared modal system, and global render.

// ── Global state ──────────────────────────────────────────────────────────────
let state = loadState();

// ── Page router ───────────────────────────────────────────────────────────────

function showHomePage() {
  document.getElementById('page-home').hidden = false;
  document.getElementById('page-trip').hidden = true;
  renderHome();
}

function showTripPage() {
  document.getElementById('page-home').hidden = true;
  document.getElementById('page-trip').hidden = false;

  const trip = getCurrentTrip(state);
  if (!trip) {
    showHomePage();
    return;
  }

  // Set header
  document.getElementById('trip-page-name').textContent = trip.name;

  renderAll();
}

/**
 * Re-render all trip-page components after any state mutation.
 */
function renderAll() {
  const trip = getCurrentTrip(state);
  if (!trip) return;

  document.getElementById('trip-page-name').textContent = trip.name;

  renderSummary(trip);
  renderItinerary(trip);
  renderOutfits(trip);
  renderCloset(trip);
}

// ── Modal system ──────────────────────────────────────────────────────────────

let modalOnPrimary = null;
let modalOnOpen = null;

/**
 * Open a reusable modal dialog.
 * @param {object} opts
 * @param {string}   opts.title
 * @param {string}   [opts.subtitle]
 * @param {string}   opts.body         — HTML string for modal body
 * @param {string}   [opts.primaryLabel] — if null, no primary button
 * @param {boolean}  [opts.primaryDanger]
 * @param {Function} [opts.onPrimary]  — return true to close, false to keep open
 * @param {Function} [opts.onOpen]     — called after modal is shown
 */
function openModal(opts) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const header = document.getElementById('modal-header');
  const body = document.getElementById('modal-body');
  const footer = document.getElementById('modal-footer');

  // Header
  header.innerHTML = `
    <div>
      <h3 class="modal-title">${opts.title}</h3>
      ${opts.subtitle ? `<p class="modal-subtitle">${opts.subtitle}</p>` : ''}
    </div>
    <button class="btn btn--ghost btn--icon modal-close-btn" id="modal-close-x" aria-label="Close modal">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  body.innerHTML = opts.body || '';

  // Footer
  if (opts.primaryLabel) {
    footer.innerHTML = `
      <button class="btn btn--ghost" id="modal-cancel-btn">Cancel</button>
      <button class="btn ${opts.primaryDanger ? 'btn--danger' : 'btn--primary'}" id="modal-primary-btn">
        ${opts.primaryLabel}
      </button>
    `;
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-primary-btn').addEventListener('click', () => {
      const result = modalOnPrimary ? modalOnPrimary() : true;
      if (result !== false) closeModal();
    });
  } else {
    footer.innerHTML = `<button class="btn btn--ghost" id="modal-cancel-btn">Close</button>`;
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  }

  document.getElementById('modal-close-x').addEventListener('click', closeModal);

  modalOnPrimary = opts.onPrimary || null;
  modalOnOpen = opts.onOpen || null;

  // Show
  overlay.hidden = false;
  overlay.classList.add('modal-overlay--visible');

  if (modalOnOpen) {
    // Wait a tick so DOM is ready
    requestAnimationFrame(() => {
      if (modalOnOpen) modalOnOpen();
    });
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.hidden = true;
  overlay.classList.remove('modal-overlay--visible');
  modalOnPrimary = null;
  modalOnOpen = null;
}

// ── Utility helpers ───────────────────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent XSS in innerHTML.
 */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Briefly shake an input to indicate a validation error.
 */
function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('input-shake');
  void el.offsetWidth; // reflow
  el.classList.add('input-shake');
  el.focus();
  setTimeout(() => el.classList.remove('input-shake'), 500);
}

/**
 * Display a temporary toast notification.
 * @param {string} message
 * @param {'info'|'success'|'error'} [type='info']
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${escHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.2s ease forwards';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}


// ── Bootstrap ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Home → back navigation
  document.getElementById('btn-home').addEventListener('click', () => {
    mobileSelectedClothingId = null;
    showHomePage();
  });

  // Overlay click-outside closes modal
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) {
      closeModal();
    }
  });

  // Escape key closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('modal-overlay').hidden) {
        closeModal();
      }
    }
  });

  // Route to correct page on load
  if (state.currentTripId && getTripById(state, state.currentTripId)) {
    showTripPage();
  } else {
    showHomePage();
  }
});
