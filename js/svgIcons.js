// svgIcons.js — Inline SVG clothing icons, colored by the item's color.

/**
 * Returns an inline SVG string representing the given clothing type,
 * filled/stroked with the given CSS color string.
 *
 * @param {string} type   — clothing type key (e.g. "tshirt", "jeans")
 * @param {string} color  — CSS color (e.g. "#3B82F6", "navy")
 * @returns {string} SVG markup
 */
function getClothingIcon(type, color) {
  const c = color || '#888888';
  const dark = darkenColor(c);

  const icons = {
    // ── TOPS ──────────────────────────────────────────────────────────────────
    tshirt: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18 L0 28 L10 32 L10 56 L50 56 L50 32 L60 28 L50 18 L38 10 Q30 16 22 10 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,

    shirt: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18 L0 28 L10 32 L10 56 L50 56 L50 32 L60 28 L50 18 L38 8 L34 14 Q30 18 26 14 L22 8 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="18" x2="30" y2="56" stroke="${dark}" stroke-width="1.5" stroke-dasharray="3 2"/>
    </svg>`,

    polo: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18 L0 28 L10 32 L10 56 L50 56 L50 32 L60 28 L50 18 L38 10 Q30 16 22 10 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M26 10 Q30 20 34 10" fill="none" stroke="${dark}" stroke-width="2"/>
      <line x1="30" y1="16" x2="30" y2="30" stroke="${dark}" stroke-width="2"/>
    </svg>`,

    tanktop: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8 L14 56 L46 56 L42 8 Q36 14 30 14 Q24 14 18 8 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M18 8 Q14 4 10 8 L14 24" fill="none" stroke="${dark}" stroke-width="2"/>
      <path d="M42 8 Q46 4 50 8 L46 24" fill="none" stroke="${dark}" stroke-width="2"/>
    </svg>`,

    kurta: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16 L2 26 L12 30 L12 58 L48 58 L48 30 L58 26 L48 16 L36 8 Q30 14 24 8 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="14" x2="30" y2="36" stroke="${dark}" stroke-width="1.5"/>
      <ellipse cx="30" cy="36" rx="4" ry="3" fill="none" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    sweater: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18 L0 28 L10 32 L10 56 L50 56 L50 32 L60 28 L50 18 L38 10 Q30 16 22 10 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M10 38 Q20 34 30 38 Q40 42 50 38" fill="none" stroke="${dark}" stroke-width="1.5"/>
      <path d="M10 44 Q20 40 30 44 Q40 48 50 44" fill="none" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    // ── BOTTOMS ───────────────────────────────────────────────────────────────
    jeans: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6 L8 14 L52 14 L52 6 Z" fill="${dark}" stroke="${dark}" stroke-width="1"/>
      <path d="M8 14 L14 56 L28 56 L30 28 L32 56 L46 56 L52 14 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="14" x2="30" y2="28" stroke="${dark}" stroke-width="1.5"/>
      <rect x="24" y="6" width="12" height="5" rx="1" fill="${dark}"/>
    </svg>`,

    trousers: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6 L8 14 L52 14 L52 6 Z" fill="${dark}" stroke="${dark}" stroke-width="1"/>
      <path d="M8 14 L12 56 L28 56 L30 26 L32 56 L48 56 L52 14 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="14" x2="30" y2="26" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    pants: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6 L8 14 L52 14 L52 6 Z" fill="${dark}" stroke="${dark}" stroke-width="1"/>
      <path d="M8 14 L12 56 L28 56 L30 26 L32 56 L48 56 L52 14 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="14" x2="30" y2="26" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    shorts: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 10 L8 16 L52 16 L52 10 Z" fill="${dark}" stroke="${dark}" stroke-width="1"/>
      <path d="M8 16 L12 40 L28 40 L30 30 L32 40 L48 40 L52 16 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="16" x2="30" y2="30" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    trackpants: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8 L8 14 L52 14 L52 8 Z" fill="${dark}" stroke="${dark}" stroke-width="1"/>
      <path d="M8 14 L12 56 L28 56 L30 26 L32 56 L48 56 L52 14 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="12" y1="20" x2="12" y2="56" stroke="${dark}" stroke-width="1.5" opacity="0.4"/>
      <line x1="48" y1="20" x2="48" y2="56" stroke="${dark}" stroke-width="1.5" opacity="0.4"/>
    </svg>`,

    skirt: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="6" width="24" height="10" rx="2" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <path d="M14 16 L6 56 L54 56 L46 16 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,

    // ── OUTERWEAR ─────────────────────────────────────────────────────────────
    jacket: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 16 L0 28 L10 34 L10 56 L50 56 L50 34 L60 28 L50 16 L38 8 L34 12 L30 20 L26 12 L22 8 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M30 20 L30 56" stroke="${dark}" stroke-width="2"/>
      <path d="M22 8 L18 16" stroke="${dark}" stroke-width="1.5"/>
      <path d="M38 8 L42 16" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    hoodie: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18 L0 28 L10 32 L10 56 L50 56 L50 32 L60 28 L50 18 L38 10 Q30 8 22 10 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M22 10 Q30 22 38 10" fill="${dark}" stroke="${dark}" stroke-width="1.5"/>
      <line x1="30" y1="22" x2="30" y2="56" stroke="${dark}" stroke-width="1.5"/>
      <rect x="24" y="40" width="12" height="8" rx="2" fill="${dark}" opacity="0.25"/>
    </svg>`,

    coat: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14 L0 26 L10 32 L10 60 L50 60 L50 32 L60 26 L50 14 L38 6 L34 12 L30 16 L26 12 L22 6 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="16" x2="30" y2="60" stroke="${dark}" stroke-width="2"/>
      <circle cx="30" cy="28" r="2" fill="${dark}"/>
      <circle cx="30" cy="36" r="2" fill="${dark}"/>
      <circle cx="30" cy="44" r="2" fill="${dark}"/>
    </svg>`,

    rainjacket: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 16 L0 28 L10 34 L10 56 L50 56 L50 34 L60 28 L50 16 L38 8 L34 12 L30 20 L26 12 L22 8 Z" fill="${c}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M30 20 L30 56" stroke="${dark}" stroke-width="2"/>
      <line x1="15" y1="36" x2="25" y2="48" stroke="${dark}" stroke-width="1" opacity="0.5"/>
      <line x1="35" y1="36" x2="45" y2="48" stroke="${dark}" stroke-width="1" opacity="0.5"/>
    </svg>`,

    blazer: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 16 L0 28 L10 34 L10 56 L50 56 L50 34 L60 28 L50 16 L38 8 L34 14 L30 20 L26 14 L22 8 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M30 20 L24 56" stroke="${dark}" stroke-width="2"/>
      <path d="M30 20 L36 56" stroke="${dark}" stroke-width="2"/>
      <rect x="14" y="30" width="8" height="5" rx="1" fill="${dark}" opacity="0.4"/>
    </svg>`,

    // ── FOOTWEAR ──────────────────────────────────────────────────────────────
    sneakers: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 38 Q6 28 18 26 L28 24 L44 28 L54 36 L54 46 Q30 50 4 46 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M18 26 L20 18 L30 20 L28 24" fill="${c}" stroke="${dark}" stroke-width="1.5"/>
      <path d="M28 32 L42 34" stroke="${dark}" stroke-width="1.5" opacity="0.6"/>
      <path d="M26 36 L40 38" stroke="${dark}" stroke-width="1.5" opacity="0.6"/>
    </svg>`,

    formalshoes: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 38 Q8 28 20 28 L28 26 L46 30 L56 38 L56 46 Q32 50 6 46 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M20 28 L22 18 L32 20 L30 26" fill="${c}" stroke="${dark}" stroke-width="1.5"/>
      <path d="M6 44 L56 44" stroke="${dark}" stroke-width="1" opacity="0.3"/>
    </svg>`,

    boots: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="8" width="16" height="28" rx="4" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <path d="M10 36 Q12 30 16 30 L32 30 L48 34 L52 44 L10 48 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="16" y1="20" x2="32" y2="20" stroke="${dark}" stroke-width="1" opacity="0.4"/>
    </svg>`,

    sandals: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="44" rx="24" ry="8" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <path d="M16 44 Q20 28 30 26 Q40 28 44 44" fill="none" stroke="${dark}" stroke-width="2.5"/>
      <line x1="22" y1="36" x2="38" y2="36" stroke="${dark}" stroke-width="2"/>
    </svg>`,

    slippers: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="44" rx="24" ry="8" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <path d="M18 38 Q26 28 34 34" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    // ── INNERWEAR ─────────────────────────────────────────────────────────────
    underwear: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 16 L16 40 L28 32 L30 40 L32 32 L44 40 L52 16 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M8 16 Q20 24 30 18 Q40 24 52 16" fill="none" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    vest: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8 L12 56 L48 56 L44 8 Q38 14 30 14 Q22 14 16 8 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M16 8 Q12 4 8 8 L12 28" fill="none" stroke="${dark}" stroke-width="2"/>
      <path d="M44 8 Q48 4 52 8 L48 28" fill="none" stroke="${dark}" stroke-width="2"/>
    </svg>`,

    socks: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 L20 36 Q20 50 34 52 Q50 54 52 42 Q54 32 42 30 L40 30 L40 4 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="20" y1="12" x2="40" y2="12" stroke="${dark}" stroke-width="2" opacity="0.5"/>
    </svg>`,

    // ── ACCESSORIES ───────────────────────────────────────────────────────────
    cap: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 32 Q10 16 30 16 Q50 16 50 32 Z" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <path d="M4 34 L56 34 Q56 38 50 38 L10 38 Q4 38 4 34 Z" fill="${c}" stroke="${dark}" stroke-width="1.5"/>
      <line x1="10" y1="34" x2="50" y2="34" stroke="${dark}" stroke-width="1.5"/>
      <circle cx="30" cy="18" r="3" fill="${dark}"/>
    </svg>`,

    hat: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="36" rx="28" ry="6" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <path d="M16 36 Q16 16 30 16 Q44 16 44 36" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <ellipse cx="30" cy="36" rx="14" ry="3" fill="${dark}" opacity="0.2"/>
    </svg>`,

    belt: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="24" width="52" height="12" rx="3" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <rect x="24" y="22" width="12" height="16" rx="2" fill="${dark}"/>
      <rect x="27" y="25" width="6" height="10" rx="1" fill="none" stroke="${c}" stroke-width="1.5"/>
    </svg>`,

    scarf: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10 Q30 20 50 10 L52 20 Q30 32 8 20 Z" fill="${c}" stroke="${dark}" stroke-width="1.5"/>
      <path d="M40 20 Q36 36 34 54" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M40 20 Q36 36 34 54" stroke="${dark}" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    </svg>`,

    gloves: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30 L10 52 Q10 56 16 56 L28 56 Q34 56 34 52 L34 36 L36 24 Q36 20 32 20 Q28 20 28 24 L28 34 L26 20 Q26 16 22 16 Q18 16 18 20 L18 34 L16 22 Q16 18 12 18 Q8 18 8 22 L10 30" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,

    sunglasses: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="28" x2="14" y2="28" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="14" y="22" width="14" height="12" rx="5" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <line x1="28" y1="28" x2="32" y2="28" stroke="${dark}" stroke-width="2"/>
      <rect x="32" y="22" width="14" height="12" rx="5" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <line x1="46" y1="28" x2="58" y2="28" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    tie: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6 L22 20 L28 22 L26 18 L30 18 L28 22 L36 20 L34 6 Z" fill="${dark}" stroke="${dark}" stroke-width="1"/>
      <path d="M22 20 L18 56 L30 48 L42 56 L38 20 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,

    // ── OTHER ─────────────────────────────────────────────────────────────────
    swimwear: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14 L16 42 L28 34 L30 42 L32 34 L44 42 L50 14 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M10 14 Q20 22 30 16 Q40 22 50 14" fill="none" stroke="${dark}" stroke-width="2"/>
      <line x1="30" y1="16" x2="30" y2="34" stroke="${dark}" stroke-width="1.5"/>
    </svg>`,

    traditionalwear: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14 L4 24 L12 28 L12 56 L48 56 L48 28 L56 24 L48 14 L36 6 Q30 12 24 6 Z" fill="${c}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M24 6 Q30 14 36 6" fill="none" stroke="${dark}" stroke-width="2"/>
      <path d="M20 30 Q30 26 40 30 L40 40 Q30 44 20 40 Z" fill="${dark}" opacity="0.2"/>
    </svg>`,

    other: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="40" height="40" rx="6" fill="${c}" stroke="${dark}" stroke-width="2"/>
      <text x="30" y="36" text-anchor="middle" font-size="20" fill="${dark}" font-family="sans-serif">?</text>
    </svg>`,
  };

  return icons[type] || icons['other'];
}

/**
 * Simple color darkening for stroke/contrast.
 * Returns a slightly darkened version of the color.
 */
function darkenColor(color) {
  // For hex colors, darken by reducing each channel
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    const r = Math.max(0, (num >> 16) - 50);
    const g = Math.max(0, ((num >> 8) & 0xff) - 50);
    const b = Math.max(0, (num & 0xff) - 50);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }
  // Named colors / other: just use a neutral dark
  return '#1a1a1a';
}

// ── Clothing type → category map ──────────────────────────────────────────────
const CLOTHING_CATEGORIES = {
  tops: {
    label: 'Tops',
    types: [
      { value: 'tshirt',   label: 'T-Shirt' },
      { value: 'shirt',    label: 'Shirt' },
      { value: 'polo',     label: 'Polo' },
      { value: 'tanktop',  label: 'Tank Top' },
      { value: 'kurta',    label: 'Kurta' },
      { value: 'sweater',  label: 'Sweater' }
    ]
  },
  bottoms: {
    label: 'Bottoms',
    types: [
      { value: 'jeans',      label: 'Jeans' },
      { value: 'trousers',   label: 'Trousers' },
      { value: 'pants',      label: 'Pants' },
      { value: 'shorts',     label: 'Shorts' },
      { value: 'trackpants', label: 'Track Pants' },
      { value: 'skirt',      label: 'Skirt' }
    ]
  },
  outerwear: {
    label: 'Outerwear',
    types: [
      { value: 'jacket',     label: 'Jacket' },
      { value: 'hoodie',     label: 'Hoodie' },
      { value: 'coat',       label: 'Coat' },
      { value: 'rainjacket', label: 'Rain Jacket' },
      { value: 'blazer',     label: 'Blazer' }
    ]
  },
  footwear: {
    label: 'Footwear',
    types: [
      { value: 'sneakers',    label: 'Sneakers' },
      { value: 'formalshoes', label: 'Formal Shoes' },
      { value: 'boots',       label: 'Boots' },
      { value: 'sandals',     label: 'Sandals' },
      { value: 'slippers',    label: 'Slippers' }
    ]
  },
  innerwear: {
    label: 'Innerwear',
    types: [
      { value: 'underwear', label: 'Underwear' },
      { value: 'vest',      label: 'Vest' },
      { value: 'socks',     label: 'Socks' }
    ]
  },
  accessories: {
    label: 'Accessories',
    types: [
      { value: 'cap',         label: 'Cap' },
      { value: 'hat',         label: 'Hat' },
      { value: 'belt',        label: 'Belt' },
      { value: 'scarf',       label: 'Scarf' },
      { value: 'gloves',      label: 'Gloves' },
      { value: 'sunglasses',  label: 'Sunglasses' },
      { value: 'tie',         label: 'Tie' }
    ]
  },
  other: {
    label: 'Other',
    types: [
      { value: 'swimwear',       label: 'Swimwear' },
      { value: 'traditionalwear', label: 'Traditional Wear' },
      { value: 'other',          label: 'Other' }
    ]
  }
};

const PRESET_COLORS = [
  { label: 'Black',  value: '#111111' },
  { label: 'White',  value: '#F5F5F5' },
  { label: 'Gray',   value: '#808080' },
  { label: 'Red',    value: '#DC2626' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Yellow', value: '#CA8A04' },
  { label: 'Green',  value: '#16A34A' },
  { label: 'Blue',   value: '#2563EB' },
  { label: 'Navy',   value: '#1E3A5F' },
  { label: 'Purple', value: '#7C3AED' },
  { label: 'Pink',   value: '#EC4899' },
  { label: 'Brown',  value: '#92400E' },
  { label: 'Beige',  value: '#D4A96A' }
];
