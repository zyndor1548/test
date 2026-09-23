// outfits.js — Center column: occasion cards, clothing popup, drag-drop targets.

/**
 * Render the center column (occasion cards).
 * @param {object} trip
 */
function renderOutfits(trip) {
  const col = document.getElementById('col-outfits');
  if (!col) return;

  if (trip.itinerary.length === 0) {
    col.innerHTML = `
      <div class="col-header">
        <h2 class="col-title">Outfits</h2>
      </div>
      <div class="empty-state empty-state--sm">
        <p class="empty-state__text">No occasions yet.</p>
        <p class="empty-state__sub">Add itinerary items to plan outfits.</p>
      </div>
    `;
    return;
  }

  // Group by day (itinerary is already sorted by data.js)
  const byDay = {};
  for (const item of trip.itinerary) {
    if (!byDay[item.day]) byDay[item.day] = [];
    byDay[item.day].push(item);
  }

  let cardsHtml = '';
  const days = Object.keys(byDay).sort((a, b) => parseInt(a) - parseInt(b));

  for (const day of days) {
    for (const item of byDay[day]) {
      const assignedIds = getAssignedClothing(trip, item.id);
      const hasClothes = assignedIds.length > 0;

      const iconsHtml = assignedIds.map(cid => {
        const cloth = getClothingById(trip, cid);
        if (!cloth) return '';
        return `
          <div class="outfit-icon" draggable="true" data-clothing-id="${cid}" data-source-occasion="${item.id}" title="${escHtml(cloth.name)}">
            <div class="outfit-icon__svg">${getClothingIcon(cloth.type, cloth.color)}</div>
            <span class="outfit-icon__name">${escHtml(cloth.name)}</span>
          </div>
        `;
      }).join('');

      cardsHtml += `
        <div class="occasion-card"
             data-occasion-id="${item.id}"
             tabindex="0">
          <div class="occasion-card__header">
            <span class="occasion-card__day">Day ${item.day}</span>
            <span class="occasion-card__time-name">${item.time} — ${escHtml(item.occasion)}</span>
          </div>
          <div class="occasion-card__body">
            ${hasClothes
              ? `<div class="outfit-icons-grid">${iconsHtml}</div>
                 <div class="occasion-card__status occasion-card__status--ok">✓ Outfit planned</div>`
              : `<div class="occasion-empty">
                   <span class="occasion-empty__icon">○</span>
                   <span class="occasion-empty__text">No clothes assigned</span>
                   <span class="occasion-empty__hint">Drag clothes here or tap a clothing item</span>
                 </div>`
            }
          </div>
        </div>
      `;
    }
  }

  col.innerHTML = `
    <div class="col-header">
      <h2 class="col-title">Outfits</h2>
    </div>
    <div class="occasion-cards" id="occasion-cards">
      ${cardsHtml}
    </div>
  `;

  bindOutfitEvents(trip);
}

/**
 * Attach drag-drop and double-click events to occasion cards.
 */
function bindOutfitEvents(trip) {
  const cards = document.querySelectorAll('.occasion-card');

  cards.forEach(card => {
    const occasionId = card.dataset.occasionId;

    // Double-click → open clothing popup
    card.addEventListener('dblclick', () => {
      openOutfitPopup(trip, occasionId);
    });

    // Drag-over: allow drop
    card.addEventListener('dragover', e => {
      e.preventDefault();
      card.classList.add('occasion-card--dragover');
    });

    card.addEventListener('dragleave', e => {
      // Only remove if leaving the card entirely
      if (!card.contains(e.relatedTarget)) {
        card.classList.remove('occasion-card--dragover');
      }
    });

    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('occasion-card--dragover');

      const clothingId = e.dataTransfer.getData('clothingId');
      const sourceOccasion = e.dataTransfer.getData('sourceOccasion');

      if (!clothingId) return;

      if (sourceOccasion && sourceOccasion !== occasionId) {
        // Moving from one occasion to another
        moveClothing(trip, clothingId, occasionId);
      } else if (!sourceOccasion) {
        // Coming from the closet
        assignClothing(trip, clothingId, occasionId);
      }
      // If sourceOccasion === occasionId, drop on same card — do nothing

      saveState(state);
      renderAll();
    });

    // Mobile tap-to-assign: tap occasion when a clothing item is selected
    card.addEventListener('click', e => {
      // Don't trigger if clicking an outfit-icon (which has its own logic)
      if (e.target.closest('.outfit-icon')) return;

      if (mobileSelectedClothingId) {
        const sourceOccasion = getClothingAssignedTo(trip, mobileSelectedClothingId);
        if (sourceOccasion !== occasionId) {
          assignClothing(trip, mobileSelectedClothingId, occasionId);
          saveState(state);
        }
        mobileSelectedClothingId = null;
        renderAll();
      }
    });
  });

  // Draggable clothing icons already in the center (for moving between occasions)
  document.querySelectorAll('.outfit-icon[draggable]').forEach(icon => {
    icon.addEventListener('dragstart', e => {
      e.dataTransfer.setData('clothingId', icon.dataset.clothingId);
      e.dataTransfer.setData('sourceOccasion', icon.dataset.sourceOccasion);
      e.dataTransfer.effectAllowed = 'move';
      icon.classList.add('dragging');
    });
    icon.addEventListener('dragend', () => {
      icon.classList.remove('dragging');
    });
  });
}

// ── Outfit Popup ──────────────────────────────────────────────────────────────

/**
 * Open the popup that lists all clothing assigned to an occasion,
 * with a Wash button for each item.
 */
function openOutfitPopup(trip, itineraryId) {
  const item = trip.itinerary.find(i => i.id === itineraryId);
  if (!item) return;

  const assignedIds = getAssignedClothing(trip, itineraryId);

  const listHtml = assignedIds.length === 0
    ? `<p class="popup-empty">No clothing assigned to this occasion.</p>`
    : assignedIds.map(cid => {
        const cloth = getClothingById(trip, cid);
        if (!cloth) return '';
        return `
          <div class="popup-clothing-item">
            <div class="popup-clothing-icon">${getClothingIcon(cloth.type, cloth.color)}</div>
            <span class="popup-clothing-name">${escHtml(cloth.name)}</span>
            <div class="popup-clothing-actions">
              <button class="btn btn--ghost btn--sm popup-wash-btn" data-clothing-id="${cid}">Wash</button>
              <button class="btn btn--ghost btn--sm btn--danger popup-remove-btn" data-clothing-id="${cid}">Remove</button>
            </div>
          </div>
        `;
      }).join('');

  openModal({
    title: escHtml(item.occasion),
    subtitle: `Day ${item.day} · ${item.time}`,
    body: `<div class="popup-clothing-list">${listHtml}</div>`,
    primaryLabel: null,  // no primary action
    onOpen: () => {
      document.querySelectorAll('.popup-wash-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          washClothing(trip, btn.dataset.clothingId);
          saveState(state);
          closeModal();
          renderAll();
        });
      });

      document.querySelectorAll('.popup-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          removeClothingFromOccasion(trip, btn.dataset.clothingId, itineraryId);
          saveState(state);
          closeModal();
          renderAll();
        });
      });
    }
  });
}

