// ── Idle Garden Game ─────────────────────────────────────────────

const CATALOG = {
  plants: [
    { id: 'daisy',      name: 'Daisy',       emoji: '🌼', cost: 10,  reward: 2,  growTime: 20,  xp: 5  },
    { id: 'rose',       name: 'Rose',        emoji: '🌹', cost: 25,  reward: 6,  growTime: 45,  xp: 12 },
    { id: 'sunflower',  name: 'Sunflower',   emoji: '🌻', cost: 40,  reward: 12, growTime: 60,  xp: 20 },
    { id: 'tulip',      name: 'Tulip',       emoji: '🌷', cost: 55,  reward: 18, growTime: 90,  xp: 30 },
    { id: 'mushroom',   name: 'Mushroom',    emoji: '🍄', cost: 80,  reward: 28, growTime: 120, xp: 45 },
    { id: 'lily',       name: 'Water Lily',  emoji: '🪷', cost: 120, reward: 42, growTime: 180, xp: 65 },
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
    { id: 'birdbath',   name: 'Bird Bath',   emoji: '🐦', cost: 70,  reward: 2,  growTime: 0,   xp: 15, isDecor: true },
    { id: 'pond',       name: 'Pond',        emoji: '💧', cost: 90,  reward: 3,  growTime: 0,   xp: 20, isDecor: true },
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
  { level: 1, name: 'Small Yard',   emoji: '🌿', cost: 150,  desc: '24 → 30 plots' },
  { level: 2, name: 'Garden Path',  emoji: '🌳', cost: 350,  desc: '30 → 36 plots' },
  { level: 3, name: 'Back Garden',  emoji: '🏡', cost: 750,  desc: '36 → 42 plots' },
  { level: 4, name: 'Grand Estate', emoji: '🏰', cost: 1500, desc: '42 → 48 plots' },
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
  el.textContent = `+${amount}🌻`;
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
      // Every 30s per reward point
      const interval = 30;
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

      const emojiEl = document.createElement('div');
      const ready = item.growTime > 0 && isFullyGrown(tile);
      emojiEl.className = 'tile-emoji' + (ready ? ' harvest-ready' : '');
      if (item.customArt) {
        emojiEl.innerHTML = itemArtHtml(item, '16px');
      } else {
        emojiEl.textContent = item.emoji;
      }
      el.appendChild(emojiEl);

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
    EXPANSIONS.forEach(exp => {
      const purchased = state.expansionLevel >= exp.level;
      const locked = state.expansionLevel < exp.level - 1;
      const canAfford = state.coins >= exp.cost;
      const el = document.createElement('div');
      el.className = 'expansion-card' +
        (purchased ? ' exp-purchased' : locked ? ' exp-locked' : canAfford ? '' : ' exp-cant-afford');
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
              ? '<span class="exp-badge locked">🔒 Locked</span>'
              : `<span class="exp-badge buy ${canAfford ? '' : 'broke'}">🌻 ${exp.cost}</span>`}
        </div>
      `;
      if (!purchased && !locked) {
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
    if (item.reward > 0 && item.growTime > 0) tooltipLines.push(`🌻 +${item.reward} coins / harvest`);
    if (item.reward > 0 && item.growTime === 0) tooltipLines.push(`🌻 +${item.reward} coins / 30s`);
    if (item.growTime > 0) tooltipLines.push(`⏱ Grows in ${item.growTime >= 60 ? (item.growTime/60).toFixed(0)+'m' : item.growTime+'s'}`);
    if (item.xp > 0) tooltipLines.push(`⭐ +${item.xp} XP`);
    if (item.bonus) tooltipLines.push(`✨ +${Math.round(item.bonus*100)}% all earnings`);
    el.innerHTML = `
      <div class="item-emoji">${itemArtHtml(item, '30px')}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-cost">🌻 ${item.cost}</div>
      ${tooltipLines.length ? `<div class="item-tooltip">${tooltipLines.join('<br>')}</div>` : ''}
    `;
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
  const ids = Object.keys(inv).filter(id => inv[id] > 0);
  if (ids.length === 0) {
    container.innerHTML = '<p style="color:#999;font-size:13px;grid-column:1/-1;text-align:center;padding:20px">Your bag is empty.<br>Visit the shop!</p>';
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
      // passive: 1 reward per 30s
      perHour += (item.reward / 30) * 3600;
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
      <div style="font-size:48px">🌻</div>
      <div style="font-size:22px;font-weight:700;color:var(--green-dark)">Level ${state.level}</div>
    </div>
    <div class="xp-bar-bg"><div class="xp-bar" style="width:${pct}%"></div></div>
    <div class="xp-label">${state.xp} / ${needed} XP</div>
    <div style="margin-top:16px">
      <div class="progress-stat"><span class="stat-label">Earning Rate</span><span class="stat-value">🌻 ${rateStr}</span></div>
      <div class="progress-stat"><span class="stat-label">Total Coins Earned</span><span class="stat-value">🌻 ${state.totalCoinsEarned}</span></div>
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
  if (state.coins < exp.cost) { toast(`Need 🌻 ${exp.cost} coins`); return; }
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

  // Empty tile — open bag to pick what to place
  if (!tile.item) {
    const hasItems = Object.keys(state.inventory).some(id => state.inventory[id] > 0);
    if (!hasItems) { toast('Buy items from the Shop first!'); return; }
    state.pendingTileIdx = idx;
    switchTab('inventory');
    return;
  }

  openTileModal(idx);
}

function placeTile(idx, itemId) {
  const tile = state.tiles[idx];
  if (tile.item) {
    toast('Tile is occupied! Remove it first.');
    return;
  }
  if (!state.inventory[itemId] || state.inventory[itemId] < 1) {
    toast('No more of that item!');
    state.selectedInvItem = null;
    renderGarden();
    return;
  }
  state.inventory[itemId]--;
  if (state.inventory[itemId] <= 0) delete state.inventory[itemId];

  const item = getItem(itemId);
  tile.item = itemId;
  tile.growthStart = Date.now();
  tile.watered = false;
  tile.wateredAt = null;
  tile.lastRewardAt = Date.now();

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
      harvestBtn.textContent = `🌻 Harvest (+${item.reward} coins)`;
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

  toast(`🌻 Harvested! +${earned} coins`);
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
