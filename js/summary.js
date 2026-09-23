// summary.js — Compute and render the packing summary bar.

/**
 * Compute summary statistics for the current trip.
 * @param {object} trip
 * @returns {{ occasions, planned, empty, totalClothes, assigned, available }}
 */
function computeSummary(trip) {
  const occasions = trip.itinerary.length;
  let planned = 0;
  let assigned = 0;

  for (const item of trip.itinerary) {
    const ids = trip.assignments[item.id] || [];
    if (ids.length > 0) {
      planned++;
      assigned += ids.length;
    }
  }

  const empty = occasions - planned;
  const totalClothes = trip.clothing.length;
  const available = totalClothes - assigned;

  return { occasions, planned, empty, totalClothes, assigned, available };
}

/**
 * Re-render the packing summary bar with fresh data from the trip.
 * @param {object} trip
 */
function renderSummary(trip) {
  const container = document.getElementById('packing-summary');
  if (!container) return;

  const s = computeSummary(trip);

  const allPlanned = s.occasions > 0 && s.empty === 0;
  const statusHtml = allPlanned
    ? `<span class="summary-status summary-status--ok">✓ All occasions have outfits</span>`
    : s.empty > 0
      ? `<span class="summary-status summary-status--warn">${s.empty} occasion${s.empty !== 1 ? 's' : ''} need${s.empty === 1 ? 's' : ''} outfits</span>`
      : `<span class="summary-status">Add occasions to get started</span>`;

  container.innerHTML = `
    <div class="summary-stats">
      <div class="summary-stat">
        <span class="summary-stat__value">${s.occasions}</span>
        <span class="summary-stat__label">Occasions</span>
      </div>
      <div class="summary-stat">
        <span class="summary-stat__value">${s.planned}</span>
        <span class="summary-stat__label">Planned</span>
      </div>
      <div class="summary-stat summary-stat--warn">
        <span class="summary-stat__value">${s.empty}</span>
        <span class="summary-stat__label">Empty</span>
      </div>
      <div class="summary-stat">
        <span class="summary-stat__value">${s.totalClothes}</span>
        <span class="summary-stat__label">Clothes</span>
      </div>
      <div class="summary-stat">
        <span class="summary-stat__value">${s.assigned}</span>
        <span class="summary-stat__label">Assigned</span>
      </div>
      <div class="summary-stat">
        <span class="summary-stat__value">${s.available}</span>
        <span class="summary-stat__label">Available</span>
      </div>
    </div>
    ${statusHtml}
  `;
}
