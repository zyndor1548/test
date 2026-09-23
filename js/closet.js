// closet.js — Right column: clothing cards, Add/Edit/Delete, search, filter, mobile select.

// Mobile tap-to-assign: tracks which clothing item is tapped
let mobileSelectedClothingId = null;

// Current filter state
let closetFilter = 'all';   // 'all' | category key
let closetSearch = '';

/**
 * Render the right column (closet).
 * @param {object} trip
 */
function renderCloset(trip) {
  const col = document.getElementById('col-closet');
  if (!col) return;

  const categories = Object.keys(CLOTHING_CATEGORIES);

  col.innerHTML = `
    <div class="col-header">
      <h2 class="col-title">Closet</h2>
      <button class="btn btn--primary btn--sm" id="btn-add-clothing">+ Add Clothing</button>
    </div>

    <div class="closet-controls">
      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input class="form-input search-input" id="closet-search" type="text"
               placeholder="Search clothes…" value="${escHtml(closetSearch)}" autocomplete="off" />
        ${closetSearch ? `<button class="search-clear" id="closet-search-clear" aria-label="Clear search">×</button>` : ''}
      </div>

      <div class="category-tabs" role="tablist" aria-label="Category filter">
        <button class="cat-tab ${closetFilter === 'all' ? 'cat-tab--active' : ''}" data-cat="all" role="tab">All</button>
        ${categories.map(key => `
          <button class="cat-tab ${closetFilter === key ? 'cat-tab--active' : ''}"
                  data-cat="${key}" role="tab">${CLOTHING_CATEGORIES[key].label}</button>
        `).join('')}
      </div>
    </div>

    <div class="clothing-list" id="clothing-list">
      ${renderClothingCards(trip)}
    </div>
  `;

  bindClosetEvents(trip);
}

/**
 * Build clothing card HTML for available (unassigned) clothing, filtered by current state.
 */
function renderClothingCards(trip) {
  let available = getAvailableClothing(trip);

  // Category filter
  if (closetFilter !== 'all') {
    available = available.filter(c => c.category === closetFilter);
  }

  // Search filter
  if (closetSearch.trim()) {
    const q = closetSearch.trim().toLowerCase();
    available = available.filter(c => c.name.toLowerCase().includes(q));
  }

  if (trip.clothing.length === 0) {
    return `
      <div class="empty-state empty-state--sm">
        <p class="empty-state__text">Your closet is empty.</p>
        <p class="empty-state__sub">Add clothing to get started.</p>
      </div>
    `;
  }

  if (available.length === 0) {
    return `<div class="empty-state empty-state--sm"><p class="empty-state__text">No clothes found.</p></div>`;
  }

  return available.map(cloth => `
    <div class="clothing-card ${mobileSelectedClothingId === cloth.id ? 'clothing-card--selected' : ''}"
         data-clothing-id="${cloth.id}"
         draggable="true"
         tabindex="0"
         role="button"
         aria-label="${escHtml(cloth.name)}">
      <div class="clothing-card__icon">${getClothingIcon(cloth.type, cloth.color)}</div>
      <span class="clothing-card__name">${escHtml(cloth.name)}</span>
      <div class="clothing-card__menu">
        <button class="btn btn--ghost btn--icon clothing-edit-btn" data-clothing-id="${cloth.id}" title="Edit">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn btn--ghost btn--icon btn--danger clothing-delete-btn" data-clothing-id="${cloth.id}" title="Delete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Bind all events for the closet column.
 */
function bindClosetEvents(trip) {
  document.getElementById('btn-add-clothing').addEventListener('click', () => {
    openAddClothingModal(trip);
  });

  // Search
  const searchInput = document.getElementById('closet-search');
  searchInput.addEventListener('input', () => {
    closetSearch = searchInput.value;
    document.getElementById('clothing-list').innerHTML = renderClothingCards(trip);
    bindClothingCardEvents(trip);
  });

  const clearBtn = document.getElementById('closet-search-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      closetSearch = '';
      renderCloset(trip);
    });
  }

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      closetFilter = tab.dataset.cat;
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('cat-tab--active'));
      tab.classList.add('cat-tab--active');
      document.getElementById('clothing-list').innerHTML = renderClothingCards(trip);
      bindClothingCardEvents(trip);
    });
  });

  bindClothingCardEvents(trip);
}

/**
 * Bind drag, edit, delete, and mobile-tap events on clothing cards.
 */
function bindClothingCardEvents(trip) {
  const list = document.getElementById('clothing-list');
  if (!list) return;

  list.querySelectorAll('.clothing-card').forEach(card => {
    const id = card.dataset.clothingId;

    // Desktop drag
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('clothingId', id);
      e.dataTransfer.setData('sourceOccasion', '');
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('dragging');
      // Deselect mobile selection if dragging
      mobileSelectedClothingId = null;
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    // Mobile tap-to-select
    card.addEventListener('click', e => {
      if (e.target.closest('.clothing-edit-btn') || e.target.closest('.clothing-delete-btn')) return;
      if (mobileSelectedClothingId === id) {
        mobileSelectedClothingId = null;
      } else {
        mobileSelectedClothingId = id;
      }
      // Re-render just cards to update highlight without full re-render
      document.getElementById('clothing-list').innerHTML = renderClothingCards(trip);
      bindClothingCardEvents(trip);
    });

    // Keyboard
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') card.click();
    });
  });

  // Edit buttons
  list.querySelectorAll('.clothing-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const cloth = getClothingById(trip, btn.dataset.clothingId);
      if (cloth) openEditClothingModal(trip, cloth);
    });
  });

  // Delete buttons
  list.querySelectorAll('.clothing-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      confirmDeleteClothing(trip, btn.dataset.clothingId);
    });
  });
}

// ── Modals ────────────────────────────────────────────────────────────────────

function buildClothingFormHtml(values = {}) {
  const catKeys = Object.keys(CLOTHING_CATEGORIES);
  const selectedCat = values.category || 'tops';
  const selectedType = values.type || CLOTHING_CATEGORIES[selectedCat].types[0].value;
  const selectedColor = values.color || '#111111';
  const name = values.name || '';
  const qty = values.quantity || 1;

  const catOptions = catKeys.map(k =>
    `<option value="${k}" ${selectedCat === k ? 'selected' : ''}>${CLOTHING_CATEGORIES[k].label}</option>`
  ).join('');

  const typeOptions = CLOTHING_CATEGORIES[selectedCat].types.map(t =>
    `<option value="${t.value}" ${selectedType === t.value ? 'selected' : ''}>${t.label}</option>`
  ).join('');

  const colorSwatches = PRESET_COLORS.map(p => `
    <button type="button" class="color-swatch ${selectedColor === p.value ? 'color-swatch--active' : ''}"
            data-color="${p.value}" style="background:${p.value};" title="${p.label}" aria-label="${p.label}"></button>
  `).join('');

  return `
    <div class="form-group">
      <label class="form-label" for="cloth-name">Name</label>
      <input class="form-input" id="cloth-name" type="text" value="${escHtml(name)}"
             placeholder="e.g. Black T-Shirt" maxlength="80" autocomplete="off" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="cloth-category">Category</label>
        <select class="form-select" id="cloth-category">${catOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label" for="cloth-type">Type</label>
        <select class="form-select" id="cloth-type">${typeOptions}</select>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Color</label>
      <div class="color-picker-wrap">
        <div class="color-swatches" id="color-swatches">${colorSwatches}</div>
        <div class="color-custom-wrap">
          <label class="form-label form-label--sm" for="cloth-color-custom">Custom</label>
          <input type="color" class="color-input-custom" id="cloth-color-custom" value="${selectedColor}" />
        </div>
      </div>
      <input type="hidden" id="cloth-color" value="${selectedColor}" />
    </div>

    ${!values._editMode ? `
    <div class="form-group form-group--sm">
      <label class="form-label" for="cloth-qty">Quantity</label>
      <input class="form-input form-input--sm" id="cloth-qty" type="number" min="1" max="20" value="${qty}" />
    </div>` : ''}
  `;
}

/**
 * Wire up color swatch + custom color interactions inside the modal.
 */
function bindColorPicker() {
  const hidden = document.getElementById('cloth-color');
  const custom = document.getElementById('cloth-color-custom');

  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('color-swatch--active'));
      sw.classList.add('color-swatch--active');
      hidden.value = sw.dataset.color;
      custom.value = sw.dataset.color;
    });
  });

  custom.addEventListener('input', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('color-swatch--active'));
    hidden.value = custom.value;
  });
}

/**
 * Wire up category → type cascade.
 */
function bindCategoryTypeCascade() {
  const catSel = document.getElementById('cloth-category');
  const typeSel = document.getElementById('cloth-type');
  catSel.addEventListener('change', () => {
    const types = CLOTHING_CATEGORIES[catSel.value].types;
    typeSel.innerHTML = types.map(t =>
      `<option value="${t.value}">${t.label}</option>`
    ).join('');
  });
}

function openAddClothingModal(trip) {
  openModal({
    title: 'Add Clothing',
    body: buildClothingFormHtml(),
    primaryLabel: 'Add',
    onPrimary: () => {
      const name = document.getElementById('cloth-name').value.trim();
      if (!name) { shakeInput('cloth-name'); return false; }
      const category = document.getElementById('cloth-category').value;
      const type = document.getElementById('cloth-type').value;
      const color = document.getElementById('cloth-color').value;
      const quantity = document.getElementById('cloth-qty').value;

      addClothing(trip, { name, category, type, color, quantity });
      saveState(state);
      renderAll();
      return true;
    },
    onOpen: () => {
      bindColorPicker();
      bindCategoryTypeCascade();
      document.getElementById('cloth-name').focus();
    }
  });
}

function openEditClothingModal(trip, cloth) {
  openModal({
    title: 'Edit Clothing',
    body: buildClothingFormHtml({ ...cloth, _editMode: true }),
    primaryLabel: 'Save',
    onPrimary: () => {
      const name = document.getElementById('cloth-name').value.trim();
      if (!name) { shakeInput('cloth-name'); return false; }
      const category = document.getElementById('cloth-category').value;
      const type = document.getElementById('cloth-type').value;
      const color = document.getElementById('cloth-color').value;

      editClothing(trip, cloth.id, { name, category, type, color });
      saveState(state);
      renderAll();
      return true;
    },
    onOpen: () => {
      bindColorPicker();
      bindCategoryTypeCascade();
      const inp = document.getElementById('cloth-name');
      inp.focus();
      inp.select();
    }
  });
}

function confirmDeleteClothing(trip, clothingId) {
  const cloth = getClothingById(trip, clothingId);
  if (!cloth) return;

  const assignedTo = getClothingAssignedTo(trip, clothingId);
  const warningHtml = assignedTo
    ? `<p class="modal-warning-text">This item is currently assigned to an occasion and will be removed from it.</p>`
    : '';

  openModal({
    title: 'Delete Clothing',
    body: `<p class="modal-confirm-text">Delete <strong>${escHtml(cloth.name)}</strong>?</p>${warningHtml}`,
    primaryLabel: 'Delete',
    primaryDanger: true,
    onPrimary: () => {
      deleteClothing(trip, clothingId);
      if (mobileSelectedClothingId === clothingId) mobileSelectedClothingId = null;
      saveState(state);
      renderAll();
      return true;
    }
  });
}
