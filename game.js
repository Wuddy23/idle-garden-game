// ── Idle Garden Game ─────────────────────────────────────────────

const CATALOG = {
  plants: [
    { id: 'daisy',      name: 'Daisy',       emoji: '🌼', cost: 10,  reward: 3,  growTime: 30,  xp: 5  },
    { id: 'rose',       name: 'Rose',        emoji: '🌹', cost: 25,  reward: 8,  growTime: 65,  xp: 12 },
    { id: 'sunflower',  name: 'Sunflower',   emoji: '🌻', cost: 40,  reward: 16, growTime: 90,  xp: 20 },
    { id: 'tulip',      name: 'Tulip',       emoji: '🌷', cost: 55,  reward: 25, growTime: 130, xp: 30 },
    { id: 'violet',     name: 'Violet',      emoji: '🪻', cost: 70,  reward: 32, growTime: 155, xp: 38,
      customArt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70"><defs><radialGradient id="vg1" cx="50%" cy="60%"><stop offset="0%" stop-color="#e0a8f0"/><stop offset="100%" stop-color="#5a1078"/></radialGradient><radialGradient id="vg2" cx="50%" cy="60%"><stop offset="0%" stop-color="#cc88e8"/><stop offset="100%" stop-color="#3d0060"/></radialGradient></defs><!-- stem --><path d="M30 42 C30 50,31 58,30 68" stroke="#3a7d2c" stroke-width="2.5" fill="none" stroke-linecap="round"/><!-- left leaf --><path d="M30 52 C26 46,14 44,10 48 C14 46,24 52,30 54 Z" fill="#4a9e38"/><!-- right leaf --><path d="M30 58 C34 52,46 50,50 54 C46 52,36 58,30 60 Z" fill="#3a8c28"/><!-- top-left petal --><ellipse cx="22" cy="14" rx="10" ry="13" fill="url(#vg1)" transform="rotate(-25 22 14)"/><!-- top-right petal --><ellipse cx="38" cy="14" rx="10" ry="13" fill="url(#vg1)" transform="rotate(25 38 14)"/><!-- left petal --><ellipse cx="13" cy="27" rx="13" ry="9" fill="url(#vg2)" transform="rotate(-15 13 27)"/><!-- right petal --><ellipse cx="47" cy="27" rx="13" ry="9" fill="url(#vg2)" transform="rotate(15 47 27)"/><!-- bottom petal --><ellipse cx="30" cy="42" rx="13" ry="10" fill="url(#vg1)"/><!-- dark center blush --><ellipse cx="30" cy="28" rx="9" ry="7" fill="#1e003a" opacity="0.3"/><!-- veins --><line x1="30" y1="33" x2="23" y2="47" stroke="#2a004a" stroke-width="0.8" opacity="0.4"/><line x1="30" y1="33" x2="30" y2="49" stroke="#2a004a" stroke-width="0.8" opacity="0.4"/><line x1="30" y1="33" x2="37" y2="47" stroke="#2a004a" stroke-width="0.8" opacity="0.4"/><!-- center --><circle cx="30" cy="26" r="5.5" fill="#140028" opacity="0.8"/><ellipse cx="30" cy="24.5" rx="4" ry="2.5" fill="#fff59d" opacity="0.95"/><circle cx="28.2" cy="24" r="1.3" fill="#f9a825"/><circle cx="31.8" cy="24" r="1.3" fill="#f9a825"/></svg>` },
    { id: 'mushroom',   name: 'Mushroom',    emoji: '🍄', cost: 80,  reward: 38, growTime: 180, xp: 45 },
    { id: 'lily',       name: 'Water Lily',  emoji: '🪷', cost: 120, reward: 55, growTime: 70,  xp: 65, pondOnly: true, noWater: true },
  ],
  trees: [
    { id: 'pine',       name: 'Pine Tree',   emoji: '🌲', cost: 60,  reward: 8,  growTime: 180, xp: 25, isTree: true },
    { id: 'maple',      name: 'Maple Tree',  emoji: '🍁', cost: 100, reward: 15, growTime: 300, xp: 45, isTree: true },
    { id: 'cherry',     name: 'Cherry Tree', emoji: '🌸', cost: 150, reward: 25, growTime: 420, xp: 70, isTree: true },
    { id: 'cactus',     name: 'Cactus',      emoji: '🌵', cost: 80,  reward: 12, growTime: 240, xp: 35, isTree: true },
    { id: 'bonsai',     name: 'Bonsai Tree', emoji: '🪴', cost: 200, reward: 35, growTime: 600, xp: 90, isTree: true,
      customArt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70"><ellipse cx="30" cy="67" rx="11" ry="2" fill="rgba(0,0,0,0.12)"/><path d="M21 59 L19 67 L41 67 L39 59 Z" fill="#8b5e3c"/><rect x="18" y="54" width="24" height="7" rx="3" fill="#a0714f"/><line x1="24" y1="56" x2="36" y2="56" stroke="#c49a6c" stroke-width="1" opacity="0.5"/><path d="M30 54 C29 44,26 34,23 22 C21 14,20 9,20 5" stroke="#4a2208" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M30 54 C29.5 44,26.5 34,23.5 22 C21.5 14,20.5 9,20.5 5" stroke="#7a4520" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="3,5" opacity="0.6"/><path d="M24 28 C31 25,42 23,50 21" stroke="#4a2208" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M21 42 C15 40,9 37,5 35" stroke="#4a2208" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M21 17 C15 14,8 11,4 9" stroke="#4a2208" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="20" cy="5" r="8" fill="#1b4332"/><circle cx="27" cy="2" r="7" fill="#2d6a4f"/><circle cx="14" cy="8" r="6" fill="#40916c"/><circle cx="24" cy="9" r="6" fill="#2d6a4f"/><circle cx="18" cy="1" r="5" fill="#52b788" opacity="0.8"/><circle cx="50" cy="19" r="7" fill="#1b4332"/><circle cx="44" cy="17" r="6" fill="#2d6a4f"/><circle cx="53" cy="25" r="6" fill="#40916c"/><circle cx="5" cy="33" r="6" fill="#2d6a4f"/><circle cx="10" cy="29" r="5" fill="#40916c"/><circle cx="4" cy="8" r="6" fill="#1b4332"/><circle cx="9" cy="5" r="5" fill="#40916c"/></svg>` },
  ],
  decorations: [
    { id: 'rock',       name: 'Stone',       emoji: '🪨', cost: 20,  reward: 0,  growTime: 0,   xp: 5,  isDecor: true },
    { id: 'lamp',       name: 'Lantern',     emoji: '🏮', cost: 50,  reward: 1,  growTime: 0,   xp: 10, isDecor: true },
    { id: 'birdbath',   name: 'Bird Bath',   emoji: '🐦', cost: 70,  reward: 2,  growTime: 0,   xp: 15, isDecor: true,
      customArt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><ellipse cx="30" cy="59" rx="9" ry="1.5" fill="rgba(0,0,0,0.15)"/><!-- base pedestal --><rect x="24" y="44" width="12" height="14" rx="2" fill="#b8a09a" stroke="#1a1a1a" stroke-width="1.8"/><!-- pedestal cap --><rect x="21" y="41" width="18" height="5" rx="2" fill="#c4b0a8" stroke="#1a1a1a" stroke-width="1.8"/><!-- bowl --><path d="M6 30 Q6 18,30 16 Q54 18,54 30 Q52 42,30 44 Q8 42,6 30 Z" fill="#c4b0a8" stroke="#1a1a1a" stroke-width="2.2"/><!-- bowl inner highlight --><path d="M38 36 Q44 34,46 38" stroke="#1a1a1a" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.4"/><!-- bird body --><ellipse cx="27" cy="25" rx="10" ry="8" fill="#5bbde4" stroke="#1a1a1a" stroke-width="1.8"/><!-- bird head --><circle cx="18" cy="20" r="7" fill="#5bbde4" stroke="#1a1a1a" stroke-width="1.8"/><!-- beak --><polygon points="10,21 14,19 14,23" fill="#f5c518" stroke="#1a1a1a" stroke-width="1"/><!-- eye --><circle cx="16" cy="19" r="1.8" fill="#1a1a1a"/><circle cx="15.4" cy="18.5" r="0.6" fill="white"/><!-- wing --><path d="M28 20 C32 12,44 10,48 14 C44 14,38 18,32 22 Z" fill="#3a8fb5" stroke="#1a1a1a" stroke-width="1.6"/><!-- wing feather lines --><path d="M36 14 C38 18,36 21,34 22" stroke="#1a1a1a" stroke-width="0.9" fill="none" opacity="0.5"/><path d="M41 13 C43 17,41 20,39 22" stroke="#1a1a1a" stroke-width="0.9" fill="none" opacity="0.5"/></svg>` },
    { id: 'pond',       name: 'Pond',        emoji: '💧', cost: 500, reward: 1,  rewardInterval: 60, growTime: 0, xp: 20, isDecor: true,
      customArt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><radialGradient id="pg" cx="42%" cy="38%"><stop offset="0%" stop-color="#90e0ef"/><stop offset="55%" stop-color="#0096c7"/><stop offset="100%" stop-color="#023e8a"/></radialGradient><clipPath id="pc"><path d="M30 2 C42 1,55 8,57 20 C60 32,54 44,46 52 C38 59,22 60,13 54 C4 48,1 36,3 24 C5 12,18 3,30 2 Z"/></clipPath></defs><path d="M30 2 C42 1,55 8,57 20 C60 32,54 44,46 52 C38 59,22 60,13 54 C4 48,1 36,3 24 C5 12,18 3,30 2 Z" fill="#023e8a" opacity="0.25"/><path d="M30 2 C42 1,55 8,57 20 C60 32,54 44,46 52 C38 59,22 60,13 54 C4 48,1 36,3 24 C5 12,18 3,30 2 Z" fill="url(#pg)"/><path d="M30 2 C42 1,55 8,57 20 C60 32,54 44,46 52 C38 59,22 60,13 54 C4 48,1 36,3 24 C5 12,18 3,30 2 Z" fill="none" stroke="#0077b6" stroke-width="1" opacity="0.4"/><ellipse cx="25" cy="20" rx="12" ry="7" fill="white" opacity="0.07" transform="rotate(-15 25 20)"/><path d="M8 28 Q13 23,18 28 Q23 33,28 28 Q33 23,38 28 Q43 33,48 29" stroke="white" stroke-width="0.9" fill="none" opacity="0.22" stroke-linecap="round" clip-path="url(#pc)"/><path d="M10 38 Q15 33,20 38 Q25 43,30 38 Q35 33,40 38 Q45 43,50 39" stroke="white" stroke-width="0.8" fill="none" opacity="0.15" stroke-linecap="round" clip-path="url(#pc)"/><ellipse cx="14" cy="44" rx="7" ry="5" fill="#52b788" opacity="0.95"/><line x1="14" y1="39" x2="14" y2="44" stroke="#2d6a4f" stroke-width="1.2"/><circle cx="14" cy="41" r="2" fill="#ff6b9d" opacity="0.9"/><ellipse cx="46" cy="16" rx="6" ry="4.5" fill="#52b788" opacity="0.95"/><line x1="46" y1="11.5" x2="46" y2="16" stroke="#2d6a4f" stroke-width="1.2"/><circle cx="46" cy="13.5" r="1.8" fill="#ff6b9d" opacity="0.9"/><ellipse cx="44" cy="48" rx="5" ry="3.5" fill="#40916c" opacity="0.9"/><line x1="44" y1="44.5" x2="44" y2="48" stroke="#2d6a4f" stroke-width="1"/><circle cx="44" cy="46" r="1.5" fill="#ff6b9d" opacity="0.8"/><path d="M24 32 Q27 29,30 32 L27 36 Z" fill="#f77f00" opacity="0.85"/><path d="M38 22 Q41 19,44 22 L41 26 Z" fill="#f4a261" opacity="0.8"/><path d="M18 22 Q20 20,22 22 L20 25 Z" fill="#f77f00" opacity="0.7"/></svg>` },
    { id: 'butterfly',  name: 'Butterfly',   emoji: '🦋', cost: 110, reward: 4,  growTime: 0,   xp: 25, isDecor: true },
  ],
  gnomes: [
    { id: 'gnome_red',  name: 'Wizard',      emoji: '🧙', cost: 80,  reward: 5,  growTime: 0,   xp: 20, isGnome: true, bonus: 0.1 },
    { id: 'gnome_blue', name: 'Elf',         emoji: '🧝', cost: 130, reward: 8,  growTime: 0,   xp: 35, isGnome: true, bonus: 0.15 },
    { id: 'gnome_gold', name: 'Genie',       emoji: '🧞', cost: 250, reward: 15, growTime: 0,   xp: 60, isGnome: true, bonus: 0.25 },
  ],
};

const ALL_ITEMS = Object.values(CATALOG).flat();
const GRID_COLS = 6;
const XP_PER_LEVEL = (lvl) => 100 * lvl;
const WATER_REGEN_SEC = 60; // 1 water per minute

const EXPANSIONS = [
  { level: 1, name: 'Small Yard',   emoji: '🌿', requiredLevel: 3,  cost: 300,  desc: '24 → 30 plots' },
  { level: 2, name: 'Garden Path',  emoji: '🌳', requiredLevel: 5,  cost: 800,  desc: '30 → 36 plots' },
  { level: 3, name: 'Back Garden',  emoji: '🏡', requiredLevel: 8,  cost: 2000, desc: '36 → 42 plots' },
  { level: 4, name: 'Grand Estate', emoji: '🏰', requiredLevel: 12, cost: 5000, desc: '42 → 48 plots' },
];

// ── State ─────────────────────────────────────────────────────────
function makeTile(id) {
  return { id, item: null, growthStart: null, watered: false, wateredAt: null, lastRewardAt: null };
}

let state = {
  coins: 30,
  water: 10,
  maxWater: 10,
  xp: 0,
  level: 1,
  totalCoinsEarned: 0,
  plantsHarvested: 0,
  expansionLevel: 0,
  lastTick: Date.now(),
  waterTimer: 0,
  tiles: Array(24).fill(null).map((_, i) => makeTile(i)),
  inventory: {},
  activeTab: 'garden',
  shopCategory: 'plants',
  selectedInvItem: null,
  pendingTileIdx: null,
};

// ── Persistence ───────────────────────────────────────────────────
function saveState() {
  try { localStorage.setItem('idleGarden_v1', JSON.stringify(state)); } catch(e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('idleGarden_v1');
    if (!raw) return;
    const saved = JSON.parse(raw);
    // Merge carefully
    state.coins = saved.coins ?? state.coins;
    state.water = saved.water ?? state.water;
    state.maxWater = saved.maxWater ?? state.maxWater;
    state.xp = saved.xp ?? state.xp;
    state.level = saved.level ?? state.level;
    state.totalCoinsEarned = saved.totalCoinsEarned ?? 0;
    state.plantsHarvested = saved.plantsHarvested ?? 0;
    state.lastTick = saved.lastTick ?? Date.now();
    state.waterTimer = saved.waterTimer ?? 0;
    state.inventory = saved.inventory ?? {};
    state.expansionLevel = saved.expansionLevel ?? 0;
    if (saved.tiles?.length >= 24) {
      state.tiles = saved.tiles;
    }
  } catch(e) {}
}

// ── Helpers ───────────────────────────────────────────────────────
function getItem(id) {
  return ALL_ITEMS.find(i => i.id === id);
}

function itemArtHtml(item, size) {
  if (item.customArt) {
    const src = 'data:image/svg+xml,' + encodeURIComponent(item.customArt);
    return `<img src="${src}" style="width:${size};height:${size};display:block">`;
  }
  return item.emoji;
}

function gnomeBonus() {
  let bonus = 1;
  state.tiles.forEach(t => {
    if (t.item) {
      const it = getItem(t.item);
      if (it?.isGnome) bonus += it.bonus;
    }
  });
  return bonus;
}

function addCoins(amount) {
  const earned = Math.ceil(amount * gnomeBonus());
  state.coins += earned;
  state.totalCoinsEarned += earned;
  return earned;
}

function addXP(amount) {
  state.xp += amount;
  const needed = XP_PER_LEVEL(state.level);
  if (state.xp >= needed) {
    state.xp -= needed;
    state.level++;
    state.maxWater = Math.min(20, 10 + Math.floor(state.level / 2));
    toast(`🎉 Level ${state.level}! Max water increased!`);
  }
}

function toast(msg, duration = 2200) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), duration);
}

function floatCoin(tileEl, amount) {
  const rect = tileEl.getBoundingClientRect();
  const container = document.getElementById('idle-particles');
  const gardenRect = container.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'coin-float';
  el.textContent = `+${amount}🪙`;
  el.style.left = (rect.left - gardenRect.left + rect.width / 2 - 16) + 'px';
  el.style.top = (rect.top - gardenRect.top) + 'px';
  container.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// ── Idle tick ─────────────────────────────────────────────────────
function tick() {
  const now = Date.now();
  const delta = (now - state.lastTick) / 1000; // seconds
  state.lastTick = now;

  // Water regen
  state.waterTimer += delta;
  while (state.waterTimer >= WATER_REGEN_SEC && state.water < state.maxWater) {
    state.water = Math.min(state.maxWater, state.water + 1);
    state.waterTimer -= WATER_REGEN_SEC;
  }
  if (state.water >= state.maxWater) state.waterTimer = 0;

  // Decorations & gnomes give passive coins slowly
  let passiveCoins = 0;
  state.tiles.forEach(tile => {
    if (!tile.item) return;
    const item = getItem(tile.item);
    if (!item) return;
    if ((item.isDecor || item.isGnome) && item.reward > 0) {
      const interval = item.rewardInterval ?? 30;
      if (!tile.lastRewardAt) tile.lastRewardAt = now;
      const elapsed = (now - tile.lastRewardAt) / 1000;
      const ticks = Math.floor(elapsed / interval);
      if (ticks > 0) {
        passiveCoins += item.reward * ticks;
        tile.lastRewardAt = now - ((elapsed % interval) * 1000);
      }
    }
  });
  if (passiveCoins > 0) addCoins(passiveCoins);

  saveState();
  renderHeader();
}

// ── Render ────────────────────────────────────────────────────────
function renderHeader() {
  document.getElementById('coins-display').textContent = Math.floor(state.coins);
  document.getElementById('water-display').textContent = state.water;
  document.getElementById('max-water-display').textContent = state.maxWater % 1 === 0 ? state.maxWater : state.maxWater.toFixed(1);
  document.getElementById('player-level').textContent = state.level;
}

function renderGarden() {
  const grid = document.getElementById('garden-grid');
  grid.innerHTML = '';

  state.tiles.forEach((tile, i) => {
    const el = document.createElement('div');
    el.className = 'garden-tile' + (tile.item ? '' : ' empty');
    el.dataset.idx = i;

    if (state.selectedInvItem) {
      el.classList.add('selected-to-place');
    }

    if (tile.item) {
      const item = getItem(tile.item);

      // Birdbath gets grassy background
      if (tile.item === 'birdbath') el.classList.add('birdbath-tile');

      // Pond gets special tile treatment
      if (tile.item === 'pond') {
        el.classList.add('pond-tile');
        const col = i % GRID_COLS, row = Math.floor(i / GRID_COLS);
        const adjTop    = state.tiles[i - GRID_COLS]?.item === 'pond';
        const adjBottom = state.tiles[i + GRID_COLS]?.item === 'pond';
        const adjLeft   = col > 0 && state.tiles[i - 1]?.item === 'pond';
        const adjRight  = col < GRID_COLS - 1 && state.tiles[i + 1]?.item === 'pond';
        renderPondPebbles(el, adjTop, adjBottom, adjLeft, adjRight, tile);
        el.addEventListener('click', () => onTileClick(i));
        grid.appendChild(el);
        return;
      }

      const ready = item.growTime > 0 && isFullyGrown(tile);
      const large = item.isDecor || item.isGnome;
      const isPlant = item.growTime > 0 && !item.isTree && !item.isDecor && !item.isGnome;

      if (isPlant) {
        // Scatter multiple icons at random positions/sizes
        const seed = i * 31 + (item.id.charCodeAt(0) || 0);
        const rnd = (n) => (Math.abs(Math.sin(seed * 127.1 + n * 311.7) * 43758.5)) % 1;
        const count = 4 + Math.floor(rnd(0) * 3); // 4–6 icons
        // Divide tile into a grid of zones so icons spread across the whole tile
        const cols = 2, rows = Math.ceil(count / cols);
        for (let k = 0; k < count; k++) {
          const icon = document.createElement('div');
          icon.className = 'plant-icon' + (ready ? ' harvest-ready' : '');
          const zoneCol = k % cols;
          const zoneRow = Math.floor(k / cols);
          const zoneW = 100 / cols, zoneH = 100 / rows;
          const left = zoneCol * zoneW + 12 + rnd(k + 2) * (zoneW - 24);
          const top  = zoneRow * zoneH + 12 + rnd(k + 3) * (zoneH - 24);
          const sz = 9 + rnd(k + 1) * 7; // 9–16px
          if (item.customArt) {
            icon.innerHTML = itemArtHtml(item, `${sz.toFixed(0)}px`);
          } else {
            icon.textContent = item.emoji;
          }
          icon.style.cssText = `position:absolute;font-size:${sz.toFixed(0)}px;left:${left.toFixed(1)}%;top:${top.toFixed(1)}%;transform:translate(-50%,-50%);line-height:1`;
          el.appendChild(icon);
        }
      } else {
        const emojiEl = document.createElement('div');
        emojiEl.className = 'tile-emoji' + (ready ? ' harvest-ready' : '') + (large ? ' decor-large' : '');
        if (item.customArt) {
          emojiEl.innerHTML = itemArtHtml(item, large ? '34px' : '16px');
        } else {
          emojiEl.textContent = item.emoji;
        }
        el.appendChild(emojiEl);
      }

      const labelEl = document.createElement('div');
      labelEl.className = 'tile-label';
      labelEl.textContent = item.name;
      el.appendChild(labelEl);

      // Growth bar for growing items
      if (item.growTime > 0) {
        const progress = getGrowthProgress(tile);
        const barBg = document.createElement('div');
        barBg.className = 'growth-bar-bg';
        const bar = document.createElement('div');
        bar.className = 'growth-bar';
        bar.style.width = (progress * 100) + '%';
        barBg.appendChild(bar);
        el.appendChild(barBg);
      }

      // Water drop if needs water
      if (item.growTime > 0 && !tile.watered) {
        const badge = document.createElement('div');
        badge.className = 'water-badge';
        badge.textContent = '💧';
        el.appendChild(badge);
      }

      // No badge for gnomes — use hover tooltip like decor
      if (item.isDecor || item.isGnome) {
        const tipEl = document.getElementById('shop-tooltip');
        const lines = [];
        if (item.isDecor && item.reward > 0) lines.push(`🪙 +${item.reward} coin${item.reward !== 1 ? 's' : ''} / ${item.rewardInterval ?? 30}s`);
        if (item.isGnome) lines.push(`✨ +${Math.round(item.bonus*100)}% all earnings`);
        if (lines.length) {
          el.addEventListener('mouseenter', () => {
            const rect = el.getBoundingClientRect();
            tipEl.innerHTML = lines.join('<br>');
            tipEl.style.display = 'block';
            tipEl.style.left = (rect.left + rect.width / 2) + 'px';
            tipEl.style.top = (rect.top - 8) + 'px';
            tipEl.style.transform = 'translateX(-50%) translateY(-100%)';
          });
          el.addEventListener('mouseleave', () => { tipEl.style.display = 'none'; });
        }
      }
    } else {
      const plus = document.createElement('div');
      plus.className = 'tile-emoji';
      plus.textContent = '➕';
      plus.style.fontSize = '20px';
      plus.style.opacity = '0.4';
      el.appendChild(plus);
    }

    el.addEventListener('click', () => onTileClick(i));
    grid.appendChild(el);
  });

  // Round corners of first and last row
  const totalTiles = state.tiles.length;
  const tlEl = grid.querySelector(`[data-idx="0"]`);
  const trEl = grid.querySelector(`[data-idx="${GRID_COLS - 1}"]`);
  const blEl = grid.querySelector(`[data-idx="${totalTiles - GRID_COLS}"]`);
  const brEl = grid.querySelector(`[data-idx="${totalTiles - 1}"]`);
  if (tlEl) tlEl.style.borderTopLeftRadius = '12px';
  if (trEl) trEl.style.borderTopRightRadius = '12px';
  if (blEl) blEl.style.borderBottomLeftRadius = '12px';
  if (brEl) brEl.style.borderBottomRightRadius = '12px';

  // Show next expansion as locked preview row
  const nextExp = EXPANSIONS.find(e => state.expansionLevel < e.level);
  if (nextExp) {
    const meetsLevel = state.level >= nextExp.requiredLevel;
    const canAfford = state.coins >= nextExp.cost;
    const label = !meetsLevel ? `Lvl ${nextExp.requiredLevel} · 🪙 ${nextExp.cost}` : `🪙 ${nextExp.cost}`;
    const row = document.createElement('div');
    row.className = 'expansion-preview-row';
    row.innerHTML = `<span class="preview-lock">🔒</span><span class="preview-label">${label}</span>`;
    row.addEventListener('click', () => {
      if (!meetsLevel) { toast(`Reach Level ${nextExp.requiredLevel} to unlock!`); return; }
      if (!canAfford) { toast(`Need 🪙 ${nextExp.cost} coins!`); return; }
      buyExpansion(nextExp.level);
    });
    grid.appendChild(row);
  }
}

function renderPondPebbles(el, adjTop, adjBottom, adjLeft, adjRight, tile) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;overflow:visible';

  const N = 6; // pebbles per side
  const sides = [
    { active: !adjTop,    pts: (s) => Array.from({length:N}, (_,k) => [(k+1)/(N+1), 0.07]) },
    { active: !adjBottom, pts: (s) => Array.from({length:N}, (_,k) => [(k+1)/(N+1), 0.93]) },
    { active: !adjLeft,   pts: (s) => Array.from({length:N}, (_,k) => [0.07, (k+1)/(N+1)]) },
    { active: !adjRight,  pts: (s) => Array.from({length:N}, (_,k) => [0.93, (k+1)/(N+1)]) },
  ];

  sides.forEach(side => {
    if (!side.active) return;
    side.pts().forEach(([cx, cy]) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', `${cx * 100}%`);
      circle.setAttribute('cy', `${cy * 100}%`);
      circle.setAttribute('r', '7.5%');
      circle.setAttribute('fill', '#c49a6c');
      circle.setAttribute('stroke', '#6b4226');
      circle.setAttribute('stroke-width', '1.5');
      svg.appendChild(circle);
    });
  });

  el.appendChild(svg);

  // Lily scattered icons on top of pond
  if (tile?.lilyItem) {
    const lilyProgress = getLilyGrowthProgress(tile);
    const lilyReady = lilyProgress >= 1;
    const tileIdx = parseInt(el.dataset.idx) || 0;
    const seed = tileIdx * 31 + 77;
    const rnd = (n) => (Math.abs(Math.sin(seed * 127.1 + n * 311.7) * 43758.5)) % 1;
    const count = 1 + Math.floor(rnd(0) * 3); // 1–3
    // Keep icons away from pebble border (~18% inset on each side)
    const margin = 18;
    const innerW = 100 - margin * 2;
    const innerH = 100 - margin * 2;
    // Divide inner area into a grid of cells equal to count, then place one lily per cell
    const cols = count === 1 ? 1 : 2;
    const rows = Math.ceil(count / cols);
    const cellW = innerW / cols;
    const cellH = innerH / rows;
    const minSz = 12, maxSz = 18;
    const halfSzPct = (maxSz / 2) / /* tile px estimate */ 80 * 100; // padding to avoid edge clip
    for (let k = 0; k < count; k++) {
      const icon = document.createElement('div');
      icon.className = 'plant-icon' + (lilyReady ? ' harvest-ready' : '');
      icon.textContent = '🪷';
      const cx = k % cols, cy = Math.floor(k / cols);
      const pad = 8; // % padding within cell so icons don't crowd edges
      const left = margin + cx * cellW + pad + rnd(k + 2) * (cellW - pad * 2);
      const top  = margin + cy * cellH + pad + rnd(k + 3) * (cellH - pad * 2);
      const sz = minSz + rnd(k + 1) * (maxSz - minSz);
      icon.style.cssText = `position:absolute;font-size:${sz.toFixed(0)}px;left:${left.toFixed(1)}%;top:${top.toFixed(1)}%;transform:translate(-50%,-50%);line-height:1;z-index:2`;
      el.appendChild(icon);
    }
    if (!lilyReady) {
      const barBg = document.createElement('div');
      barBg.className = 'growth-bar-bg';
      const bar = document.createElement('div');
      bar.className = 'growth-bar';
      bar.style.width = (lilyProgress * 100) + '%';
      barBg.appendChild(bar);
      el.appendChild(barBg);
    }
  }

  // Hover tooltip showing pond benefit
  const pondItem = getItem('pond');
  const tip = document.getElementById('shop-tooltip');
  el.addEventListener('mouseenter', () => {
    const rect = el.getBoundingClientRect();
    tip.innerHTML = `🪙 +${pondItem.reward} coin / ${pondItem.rewardInterval ?? 30}s`;
    tip.style.display = 'block';
    tip.style.left = (rect.left + rect.width / 2) + 'px';
    tip.style.top = (rect.top - 8) + 'px';
    tip.style.transform = 'translateX(-50%) translateY(-100%)';
  });
  el.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
}


function getGrowthProgress(tile) {
  if (!tile.item || !tile.growthStart) return 0;
  const item = getItem(tile.item);
  if (!item || item.growTime === 0) return 1;
  const waterMultiplier = tile.watered ? 1.5 : 1;
  const elapsed = (Date.now() - tile.growthStart) / 1000 * waterMultiplier;
  return Math.min(1, elapsed / item.growTime);
}

function isFullyGrown(tile) {
  return getGrowthProgress(tile) >= 1;
}

function renderShop() {
  const container = document.getElementById('shop-items');
  container.innerHTML = '';

  if (state.shopCategory === 'land') {
    container.className = 'land-list';
    let shownLocked = false;
    EXPANSIONS.forEach(exp => {
      const purchased = state.expansionLevel >= exp.level;
      const prevPurchased = state.expansionLevel >= exp.level - 1;
      const meetsLevel = state.level >= exp.requiredLevel;
      const canAfford = state.coins >= exp.cost;
      const available = prevPurchased && meetsLevel;
      const locked = !prevPurchased || !meetsLevel;
      // Only show the first locked expansion as a preview; hide the rest
      if (locked) {
        if (shownLocked) return;
        shownLocked = true;
      }
      const el = document.createElement('div');
      el.className = 'expansion-card' + (purchased ? ' exp-purchased' : locked ? ' exp-locked' : '');
      el.innerHTML = `
        <div class="exp-icon">${exp.emoji}</div>
        <div class="exp-info">
          <div class="exp-name">${exp.name}</div>
          <div class="exp-desc">${exp.desc}</div>
        </div>
        <div class="exp-action">
          ${purchased
            ? '<span class="exp-badge purchased">✓ Owned</span>'
            : locked
              ? `<span class="exp-badge locked">🔒 Lvl ${exp.requiredLevel}</span>`
              : `<span class="exp-badge buy ${canAfford ? '' : 'broke'}">🪙 ${exp.cost}</span>`}
        </div>
      `;
      if (available && !purchased && canAfford) {
        el.addEventListener('click', () => buyExpansion(exp.level));
      }
      container.appendChild(el);
    });
    return;
  }

  container.className = '';
  const items = CATALOG[state.shopCategory] || [];
  items.forEach(item => {
    const el = document.createElement('div');
    const canAfford = state.coins >= item.cost;
    el.className = 'shop-item' + (canAfford ? '' : ' item-cant-afford');
    const tooltipLines = [];
    if (item.reward > 0 && item.growTime > 0) tooltipLines.push(`🪙 +${item.reward} coins / harvest`);
    if (item.reward > 0 && item.growTime === 0) tooltipLines.push(`🪙 +${item.reward} coin${item.reward !== 1 ? 's' : ''} / ${item.rewardInterval ?? 30}s`);
    if (item.growTime > 0) tooltipLines.push(`⏱ Grows in ${item.growTime >= 60 ? (item.growTime/60).toFixed(0)+'m' : item.growTime+'s'}`);
    if (item.xp > 0) tooltipLines.push(`⭐ +${item.xp} XP`);
    if (item.bonus) tooltipLines.push(`✨ +${Math.round(item.bonus*100)}% all earnings`);
    if (item.pondOnly) tooltipLines.push(`🪷 Ponds only`);
    el.innerHTML = `
      <div class="item-emoji">${itemArtHtml(item, '30px')}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-cost">🪙 ${item.cost}</div>
    `;
    if (tooltipLines.length) {
      const tip = document.getElementById('shop-tooltip');
      el.addEventListener('mouseenter', (e) => {
        const rect = el.getBoundingClientRect();
        tip.innerHTML = tooltipLines.join('<br>');
        tip.style.display = 'block';
        tip.style.left = (rect.left + rect.width / 2) + 'px';
        tip.style.top = (rect.top - 8) + 'px';
        tip.style.transform = 'translateX(-50%) translateY(-100%)';
      });
      el.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    }
    if (canAfford) {
      el.addEventListener('click', () => buyItem(item.id));
    } else {
      el.title = 'Not enough coins';
    }
    container.appendChild(el);
  });
}

function renderInventory() {
  const container = document.getElementById('inventory-items');
  container.innerHTML = '';
  const inv = state.inventory;
  const pendingIsPond = state.pendingTileIdx !== null && state.tiles[state.pendingTileIdx]?.item === 'pond';
  const ids = Object.keys(inv).filter(id => {
    if (inv[id] <= 0) return false;
    const it = getItem(id);
    if (it?.pondOnly && !pendingIsPond) return false; // hide pond-only items for soil tiles
    if (!it?.pondOnly && pendingIsPond) return false;  // hide soil items when planting in pond
    return true;
  });
  if (ids.length === 0) {
    container.innerHTML = pendingIsPond
      ? '<p style="color:#999;font-size:13px;grid-column:1/-1;text-align:center;padding:20px">No Water Lilies in bag.<br>Buy some from the Shop!</p>'
      : '<p style="color:#999;font-size:13px;grid-column:1/-1;text-align:center;padding:20px">Your bag is empty.<br>Visit the shop!</p>';
    return;
  }
  ids.forEach(id => {
    const item = getItem(id);
    if (!item) return;
    const el = document.createElement('div');
    el.className = 'inv-item' + (state.selectedInvItem === id ? ' selected' : '');
    el.innerHTML = `
      <div class="item-emoji">${itemArtHtml(item, '30px')}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-count">×${inv[id]}</div>
    `;
    el.addEventListener('click', () => selectInvItem(id));
    container.appendChild(el);
  });
}

function calcEarningRate() {
  // Returns coins/hour from all placed items (before gnome bonus)
  let perHour = 0;
  state.tiles.forEach(tile => {
    if (!tile.item) return;
    const item = getItem(tile.item);
    if (!item) return;
    if (item.growTime > 0 && item.reward > 0) {
      // harvest cycle: reward every growTime seconds
      perHour += (item.reward / item.growTime) * 3600;
    } else if ((item.isDecor || item.isGnome) && item.reward > 0) {
      perHour += (item.reward / (item.rewardInterval ?? 30)) * 3600;
    }
  });
  return Math.round(perHour * gnomeBonus());
}

function renderProgress() {
  const needed = XP_PER_LEVEL(state.level);
  const pct = Math.min(100, Math.round((state.xp / needed) * 100));
  const rate = calcEarningRate();
  const rateStr = rate >= 3600
    ? `${(rate/3600).toFixed(1)}/s`
    : rate >= 60
      ? `${(rate/60).toFixed(1)}/min`
      : `${rate}/hr`;
  document.getElementById('progress-content').innerHTML = `
    <div style="text-align:center;padding:10px 0 16px">
      <div style="font-size:48px">🪙</div>
      <div style="font-size:22px;font-weight:700;color:var(--green-dark)">Level ${state.level}</div>
    </div>
    <div class="xp-bar-bg"><div class="xp-bar" style="width:${pct}%"></div></div>
    <div class="xp-label">${state.xp} / ${needed} XP</div>
    <div style="margin-top:16px">
      <div class="progress-stat"><span class="stat-label">Earning Rate</span><span class="stat-value">🪙 ${rateStr}</span></div>
      <div class="progress-stat"><span class="stat-label">Total Coins Earned</span><span class="stat-value">🪙 ${state.totalCoinsEarned}</span></div>
      <div class="progress-stat"><span class="stat-label">Plants Harvested</span><span class="stat-value">${state.plantsHarvested}</span></div>
      <div class="progress-stat"><span class="stat-label">Garden Plots</span><span class="stat-value">🏡 ${state.tiles.length}</span></div>
      <div class="progress-stat"><span class="stat-label">Water Capacity</span><span class="stat-value">💧 ${state.maxWater}</span></div>
      <div class="progress-stat"><span class="stat-label">Water Refill</span><span class="stat-value">${
        state.water >= state.maxWater
          ? '💧 Full'
          : `+1 💧 in ${Math.ceil(WATER_REGEN_SEC - (state.waterTimer % WATER_REGEN_SEC))}s`
      }</span></div>
      <div class="progress-stat"><span class="stat-label">Gnome Bonus</span><span class="stat-value">+${Math.round((gnomeBonus()-1)*100)}%</span></div>
    </div>
  `;
}

// ── Actions ───────────────────────────────────────────────────────
function buyExpansion(level) {
  const exp = EXPANSIONS.find(e => e.level === level);
  if (!exp) return;
  if (state.expansionLevel >= level) { toast('Already purchased!'); return; }
  if (state.expansionLevel < level - 1) { toast('Unlock the previous expansion first!'); return; }
  if (state.level < exp.requiredLevel) { toast(`Reach Level ${exp.requiredLevel} to unlock!`); return; }
  if (state.coins < exp.cost) { toast(`Need 🪙 ${exp.cost} coins!`); return; }
  state.coins -= exp.cost;
  state.expansionLevel = level;
  const startId = state.tiles.length;
  for (let i = 0; i < 6; i++) state.tiles.push(makeTile(startId + i));
  addXP(50);
  toast(`${exp.emoji} ${exp.name} unlocked! +4 plots`);
  renderGarden();
  renderShop();
  renderHeader();
  saveState();
}

function buyItem(id) {
  const item = getItem(id);
  if (!item || state.coins < item.cost) return;
  state.coins -= item.cost;
  state.inventory[id] = (state.inventory[id] || 0) + 1;
  addXP(Math.ceil(item.xp * 0.1));
  toast(`Bought ${item.emoji} ${item.name}!`);
  renderShop();
  saveState();
}

function selectInvItem(id) {
  // If we came from tapping an empty tile, place directly
  if (state.pendingTileIdx !== null) {
    const idx = state.pendingTileIdx;
    state.pendingTileIdx = null;
    switchTab('garden');
    placeTile(idx, id);
    return;
  }

  if (state.selectedInvItem === id) {
    state.selectedInvItem = null;
    toast('Selection cleared');
  } else {
    state.selectedInvItem = id;
    const item = getItem(id);
    toast(`${item.emoji} Tap a garden tile to place`);
    switchTab('garden');
  }
  renderInventory();
  renderGarden();
}


function onTileClick(idx) {
  const tile = state.tiles[idx];

  if (state.selectedInvItem) {
    placeTile(idx, state.selectedInvItem);
    return;
  }

  // One-tap harvest if ready
  if (tile.item && isFullyGrown(tile)) {
    const item = getItem(tile.item);
    if (item.growTime > 0) {
      harvestTile(idx);
      return;
    }
  }

  // One-tap water if growing and needs water
  if (tile.item && !isFullyGrown(tile)) {
    const item = getItem(tile.item);
    if (item.growTime > 0 && !tile.watered && state.water > 0) {
      waterTile(idx);
      return;
    }
  }

  // Pond tile — handle lily interactions or offer to plant lily
  if (tile.item === 'pond') {
    if (tile.lilyItem) {
      const lilyGrown = getLilyGrowthProgress(tile) >= 1;
      if (lilyGrown) { harvestLily(idx); return; }
      // Lilies can't be watered — they grow in the pond naturally
    } else {
      if (state.inventory['lily'] > 0) {
        state.pendingTileIdx = idx;
        switchTab('inventory');
      } else {
        toast('Buy Water Lilies from the Shop to plant here!');
      }
    }
    return;
  }

  // Empty tile — open bag to pick what to place
  if (!tile.item) {
    const hasItems = Object.keys(state.inventory).some(id => state.inventory[id] > 0 && !getItem(id)?.pondOnly);
    if (!hasItems) { toast('Buy items from the Shop first!'); return; }
    state.pendingTileIdx = idx;
    switchTab('inventory');
    return;
  }

  openTileModal(idx);
}

function placeTile(idx, itemId) {
  const tile = state.tiles[idx];
  const item = getItem(itemId);

  // Pond tiles can host a water lily on top
  if (tile.item === 'pond') {
    if (itemId !== 'lily') { toast('Only Water Lilies can be planted in ponds!'); return; }
    if (tile.lilyItem) { toast('This pond already has a lily!'); return; }
  } else {
    if (tile.item) { toast('Tile is occupied! Remove it first.'); return; }
    if (item?.pondOnly) { toast('🪷 Water Lilies can only grow in ponds!'); return; }
  }
  if (!state.inventory[itemId] || state.inventory[itemId] < 1) {
    toast('No more of that item!');
    state.selectedInvItem = null;
    renderGarden();
    return;
  }
  state.inventory[itemId]--;
  if (state.inventory[itemId] <= 0) delete state.inventory[itemId];

  if (tile.item === 'pond' && itemId === 'lily') {
    tile.lilyItem = itemId;
    tile.lilyGrowthStart = Date.now();
    tile.lilyWatered = false;
  } else {
    tile.item = itemId;
    tile.growthStart = Date.now();
    tile.watered = false;
    tile.wateredAt = null;
    tile.lastRewardAt = Date.now();
    if (itemId === 'pond') { state.maxWater += 0.5; renderHeader(); }
  }

  state.selectedInvItem = null;
  addXP(item.xp);
  toast(`${item.emoji} ${item.name} placed!`);
  renderGarden();
  saveState();

  // Pop animation
  const tileEl = document.querySelector(`[data-idx="${idx}"] .tile-emoji`);
  if (tileEl) {
    tileEl.classList.add('grow-pop');
    setTimeout(() => tileEl.classList.remove('grow-pop'), 500);
  }
}

function openTileModal(idx) {
  const tile = state.tiles[idx];
  const modal = document.getElementById('tile-modal');
  const info = document.getElementById('tile-modal-info');
  const actions = document.getElementById('tile-modal-actions');
  actions.innerHTML = '';

  if (!tile.item) {
    // Empty tile — show inventory if any
    const invIds = Object.keys(state.inventory).filter(id => state.inventory[id] > 0);
    if (invIds.length === 0) {
      info.innerHTML = `<span class="modal-emoji">🌱</span><h3>Empty Plot</h3><p>Buy items from the Shop first!</p>`;
    } else {
      info.innerHTML = `<span class="modal-emoji">🌱</span><h3>Empty Plot</h3><p>Choose what to plant:</p>`;
      invIds.forEach(id => {
        const item = getItem(id);
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = `${item.emoji} Plant ${item.name} (×${state.inventory[id]})`;
        btn.addEventListener('click', () => {
          closeTileModal();
          placeTile(idx, id);
        });
        actions.appendChild(btn);
      });
    }
  } else {
    const item = getItem(tile.item);
    const grown = isFullyGrown(tile);
    const pct = Math.round(getGrowthProgress(tile) * 100);

    let statusText = item.growTime === 0 ? 'Permanent decoration' :
      grown ? '✅ Ready to harvest!' : `Growing… ${pct}%`;

    info.innerHTML = `
      <span class="modal-emoji">${item.customArt ? itemArtHtml(item, '52px') : item.emoji}</span>
      <h3>${item.name}</h3>
      <p>${statusText}</p>
    `;

    // Water button
    if (item.growTime > 0 && !grown) {
      const waterBtn = document.createElement('button');
      waterBtn.className = 'action-btn';
      const canWater = state.water > 0 && !tile.watered;
      waterBtn.textContent = tile.watered ? '💧 Already watered' : `💧 Water (${state.water} left)`;
      waterBtn.disabled = !canWater;
      waterBtn.addEventListener('click', () => {
        waterTile(idx);
        closeTileModal();
      });
      actions.appendChild(waterBtn);
    }

    // Harvest button
    if (item.growTime > 0 && grown) {
      const harvestBtn = document.createElement('button');
      harvestBtn.className = 'action-btn';
      harvestBtn.textContent = `🪙 Harvest (+${item.reward} coins)`;
      harvestBtn.addEventListener('click', () => {
        harvestTile(idx);
        closeTileModal();
      });
      actions.appendChild(harvestBtn);
    }

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'action-btn danger';
    removeBtn.textContent = '🗑️ Remove';
    removeBtn.addEventListener('click', () => {
      removeTile(idx);
      closeTileModal();
    });
    actions.appendChild(removeBtn);
  }

  modal.classList.remove('hidden');
}

function closeTileModal() {
  document.getElementById('tile-modal').classList.add('hidden');
}

function getLilyGrowthProgress(tile) {
  if (!tile.lilyItem || !tile.lilyGrowthStart) return 0;
  const item = getItem(tile.lilyItem);
  if (!item) return 0;
  const mult = tile.lilyWatered ? 1.5 : 1;
  return Math.min(1, ((Date.now() - tile.lilyGrowthStart) / 1000 * mult) / item.growTime);
}

function waterLily(idx) {
  const tile = state.tiles[idx];
  if (state.water <= 0) { toast('No water left!'); return; }
  if (tile.lilyWatered) { toast('Already watered!'); return; }
  state.water--;
  tile.lilyWatered = true;
  toast('💧 Lily watered! Growth +50%');
  renderGarden(); renderHeader(); saveState();
}

function harvestLily(idx) {
  const tile = state.tiles[idx];
  if (getLilyGrowthProgress(tile) < 1) { toast('Not ready yet!'); return; }
  const item = getItem(tile.lilyItem);
  const earned = addCoins(item.reward);
  addXP(item.xp);
  state.plantsHarvested++;
  const tileEl = document.querySelector(`[data-idx="${idx}"]`);
  if (tileEl) floatCoin(tileEl, earned);
  // Re-plant
  tile.lilyGrowthStart = Date.now();
  tile.lilyWatered = false;
  toast(`🪷 Harvested! +${earned} coins`);
  renderGarden(); saveState();
}

function waterTile(idx) {
  const tile = state.tiles[idx];
  if (state.water <= 0) { toast('No water left! It refills over time.'); return; }
  if (tile.watered) { toast('Already watered!'); return; }
  state.water--;
  tile.watered = true;
  tile.wateredAt = Date.now();
  // Re-adjust growthStart to account for acceleration (1.5x)
  // We calculate already-elapsed time at 1x and convert
  const item = getItem(tile.item);
  if (tile.growthStart) {
    const elapsed = (Date.now() - tile.growthStart) / 1000;
    const effectiveElapsed = elapsed; // already elapsed at 1x
    // From now on grows 1.5x — we simulate by shifting growthStart
    // remaining = growTime - effectiveElapsed; new_remaining = remaining / 1.5
    // new growthStart = now - effectiveElapsed (keep progress, speed up future)
    // handled in getGrowthProgress via watered flag
  }
  toast('💧 Watered! Growth speed +50%');
  renderGarden();
  renderHeader();
  saveState();
}

function harvestTile(idx) {
  const tile = state.tiles[idx];
  const item = getItem(tile.item);
  if (!isFullyGrown(tile)) { toast('Not ready yet!'); return; }

  const earned = addCoins(item.reward);
  addXP(item.xp);
  state.plantsHarvested++;

  const tileEl = document.querySelector(`[data-idx="${idx}"]`);
  if (tileEl) floatCoin(tileEl, earned);

  // Reset tile for re-growing
  tile.growthStart = Date.now();
  tile.watered = false;
  tile.wateredAt = null;

  toast(`🪙 Harvested! +${earned} coins`);
  renderGarden();
  renderHeader();
  saveState();
}

function removeTile(idx) {
  const tile = state.tiles[idx];
  const item = getItem(tile.item);
  // Return item to inventory at 50% value if unfinished, full if decor
  if (item.isDecor || item.isGnome || item.isTree) {
    state.inventory[tile.item] = (state.inventory[tile.item] || 0) + 1;
    toast(`${item.emoji} ${item.name} returned to bag`);
  } else {
    toast(`${item.emoji} ${item.name} removed`);
  }
  if (tile.item === 'pond') { state.maxWater = Math.max(10, state.maxWater - 0.5); renderHeader(); }
  tile.item = null;
  tile.growthStart = null;
  tile.watered = false;
  tile.lastRewardAt = null;
  renderGarden();
  saveState();
}

// ── Tab Navigation ────────────────────────────────────────────────
function switchTab(tab) {
  if (tab !== 'inventory') state.pendingTileIdx = null;
  state.activeTab = tab;

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  // Hide all panels
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));

  if (tab === 'shop') {
    document.getElementById('shop-panel').classList.remove('hidden');
    renderShop();
  } else if (tab === 'inventory') {
    document.getElementById('inventory-panel').classList.remove('hidden');
    renderInventory();
  } else if (tab === 'progress') {
    document.getElementById('progress-panel').classList.remove('hidden');
    renderProgress();
  }
}

// ── Init ──────────────────────────────────────────────────────────
function init() {
  loadState();
  renderHeader();
  renderGarden();

  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Shop tabs
  document.querySelectorAll('.shop-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.shopCategory = btn.dataset.category;
      document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderShop();
    });
  });

  // Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.close).classList.add('hidden');
      switchTab('garden');
    });
  });

  // Level display click → XP progress popup
  document.getElementById('level-display').addEventListener('click', () => {
    const needed = XP_PER_LEVEL(state.level);
    const pct = Math.min(100, Math.round((state.xp / needed) * 100));
    const nextExp = EXPANSIONS.find(e => state.level < e.requiredLevel && state.expansionLevel < e.level);
    const modal = document.getElementById('tile-modal');
    const info = document.getElementById('tile-modal-info');
    const actions = document.getElementById('tile-modal-actions');
    actions.innerHTML = '';
    info.innerHTML = `
      <div class="modal-emoji">⭐</div>
      <h3>Level ${state.level}</h3>
      <p style="margin-bottom:8px">${state.xp} / ${needed} XP</p>
      <div style="background:#e0e0e0;border-radius:8px;height:14px;overflow:hidden;margin:0 0 12px">
        <div style="background:var(--green-mid);height:100%;width:${pct}%;transition:width 0.3s"></div>
      </div>
      ${nextExp
        ? `<p style="color:#888;font-size:13px">Reach <strong>Level ${nextExp.requiredLevel}</strong> to unlock <strong>${nextExp.emoji} ${nextExp.name}</strong></p>`
        : '<p style="color:#888;font-size:13px">All expansions unlocked!</p>'}
    `;
    modal.classList.remove('hidden');
  });

  // Modal close
  document.getElementById('tile-modal-close').addEventListener('click', closeTileModal);
  document.getElementById('tile-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('tile-modal')) closeTileModal();
  });

  // Tick loop
  setInterval(() => {
    tick();
    renderGarden();
    if (state.activeTab === 'progress') renderProgress();
    if (state.activeTab === 'shop') renderShop();
  }, 1000);

  // Growth animation loop (lighter)
  setInterval(() => {
    if (state.activeTab === 'garden') {
      document.querySelectorAll('.growth-bar').forEach((bar, i) => {
        const tile = state.tiles.find((t, ti) => {
          return document.querySelectorAll('.growth-bar')[i]?.closest('[data-idx]')?.dataset.idx == ti;
        });
      });
    }
  }, 5000);

  toast('🌱 Welcome to Idle Garden!', 3000);
}

document.addEventListener('DOMContentLoaded', init);
