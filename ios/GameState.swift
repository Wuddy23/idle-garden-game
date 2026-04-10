import SwiftUI
import Combine

// MARK: - Models

struct CatalogItem: Codable, Identifiable {
    let id: String
    let name: String
    let emoji: String
    let cost: Int
    let reward: Int
    let growTime: Double  // seconds; 0 = permanent
    let xp: Int
    var isTree: Bool = false
    var isDecor: Bool = false
    var isGnome: Bool = false
    var gnomeBonus: Double = 0
}

struct GardenTile: Codable, Identifiable {
    var id: Int
    var itemId: String?
    var growthStart: Date?
    var watered: Bool = false
    var wateredAt: Date?
    var lastRewardAt: Date?
}

struct Expansion: Identifiable {
    let id: Int
    let name: String
    let emoji: String
    let cost: Int
    let desc: String
}

// MARK: - Catalog

let plantItems: [CatalogItem] = [
    .init(id: "daisy",     name: "Daisy",       emoji: "🌼", cost: 10,  reward: 2,  growTime: 20,  xp: 5),
    .init(id: "rose",      name: "Rose",        emoji: "🌹", cost: 25,  reward: 6,  growTime: 45,  xp: 12),
    .init(id: "sunflower", name: "Sunflower",   emoji: "🌻", cost: 40,  reward: 12, growTime: 60,  xp: 20),
    .init(id: "tulip",     name: "Tulip",       emoji: "🌷", cost: 55,  reward: 18, growTime: 90,  xp: 30),
    .init(id: "mushroom",  name: "Mushroom",    emoji: "🍄", cost: 80,  reward: 28, growTime: 120, xp: 45),
    .init(id: "lily",      name: "Water Lily",  emoji: "🪷", cost: 120, reward: 42, growTime: 180, xp: 65),
]

let treeItems: [CatalogItem] = [
    .init(id: "pine",   name: "Pine Tree",   emoji: "🌲", cost: 60,  reward: 8,  growTime: 180, xp: 25, isTree: true),
    .init(id: "maple",  name: "Maple Tree",  emoji: "🍁", cost: 100, reward: 15, growTime: 300, xp: 45, isTree: true),
    .init(id: "cherry", name: "Cherry Tree", emoji: "🌸", cost: 150, reward: 25, growTime: 420, xp: 70, isTree: true),
    .init(id: "cactus", name: "Cactus",      emoji: "🌵", cost: 80,  reward: 12, growTime: 240, xp: 35, isTree: true),
]

let decorItems: [CatalogItem] = [
    .init(id: "rock",      name: "Stone",     emoji: "🪨", cost: 20,  reward: 0, growTime: 0, xp: 5,  isDecor: true),
    .init(id: "fence",     name: "Fence",     emoji: "🪵", cost: 15,  reward: 0, growTime: 0, xp: 5,  isDecor: true),
    .init(id: "lamp",      name: "Lantern",   emoji: "🏮", cost: 50,  reward: 1, growTime: 0, xp: 10, isDecor: true),
    .init(id: "birdbath",  name: "Bird Bath", emoji: "🐦", cost: 70,  reward: 2, growTime: 0, xp: 15, isDecor: true),
    .init(id: "pond",      name: "Pond",      emoji: "💧", cost: 90,  reward: 3, growTime: 0, xp: 20, isDecor: true),
    .init(id: "butterfly", name: "Butterfly", emoji: "🦋", cost: 110, reward: 4, growTime: 0, xp: 25, isDecor: true),
]

let gnomeItems: [CatalogItem] = [
    .init(id: "gnome_red",  name: "Wizard",     emoji: "🧙", cost: 80,  reward: 5,  growTime: 0, xp: 20, isGnome: true, gnomeBonus: 0.10),
    .init(id: "gnome_blue", name: "Elf",        emoji: "🧝", cost: 130, reward: 8,  growTime: 0, xp: 35, isGnome: true, gnomeBonus: 0.15),
    .init(id: "gnome_gold", name: "Genie",      emoji: "🧞", cost: 250, reward: 15, growTime: 0, xp: 60, isGnome: true, gnomeBonus: 0.25),
]

let allCatalogItems: [CatalogItem] = plantItems + treeItems + decorItems + gnomeItems

let allExpansions: [Expansion] = [
    Expansion(id: 1, name: "Small Yard",   emoji: "🌿", cost: 150,  desc: "16 → 20 plots"),
    Expansion(id: 2, name: "Garden Path",  emoji: "🌳", cost: 350,  desc: "20 → 24 plots"),
    Expansion(id: 3, name: "Back Garden",  emoji: "🏡", cost: 750,  desc: "24 → 28 plots"),
    Expansion(id: 4, name: "Grand Estate", emoji: "🏰", cost: 1500, desc: "28 → 32 plots"),
]

func findItem(_ id: String) -> CatalogItem? {
    allCatalogItems.first { $0.id == id }
}

// MARK: - GameState

class GameState: ObservableObject {
    @Published var coins: Double = 30
    @Published var water: Int = 10
    @Published var maxWater: Int = 10
    @Published var xp: Int = 0
    @Published var level: Int = 1
    @Published var totalCoinsEarned: Int = 0
    @Published var plantsHarvested: Int = 0
    @Published var expansionLevel: Int = 0
    @Published var tiles: [GardenTile] = (0..<16).map { GardenTile(id: $0) }
    @Published var inventory: [String: Int] = [:]
    @Published var toastMessage: String = ""

    private var waterTimer: Double = 0
    private var lastTick: Date = Date()
    private var ticker: AnyCancellable?
    private var toastWork: DispatchWorkItem?

    init() {
        load()
        ticker = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in self?.tick() }
    }

    // MARK: - Tick

    private func tick() {
        let now = Date()
        let delta = now.timeIntervalSince(lastTick)
        lastTick = now

        waterTimer += delta
        while waterTimer >= 60, water < maxWater {
            water = min(maxWater, water + 1)
            waterTimer -= 60
        }
        if water >= maxWater { waterTimer = 0 }

        var passive = 0.0
        for i in tiles.indices {
            guard let id = tiles[i].itemId, let item = findItem(id) else { continue }
            guard (item.isDecor || item.isGnome), item.reward > 0 else { continue }
            let base = tiles[i].lastRewardAt ?? now
            let elapsed = now.timeIntervalSince(base)
            let ticks = floor(elapsed / 30)
            if ticks > 0 {
                passive += Double(item.reward) * ticks
                tiles[i].lastRewardAt = now.addingTimeInterval(-(elapsed.truncatingRemainder(dividingBy: 30)))
            }
        }
        if passive > 0 { addCoins(passive) }
        save()
    }

    // MARK: - Helpers

    func gnomeMultiplier() -> Double {
        tiles.reduce(1.0) { acc, tile in
            guard let id = tile.itemId, let item = findItem(id), item.isGnome else { return acc }
            return acc + item.gnomeBonus
        }
    }

    @discardableResult
    func addCoins(_ amount: Double) -> Int {
        let earned = Int(ceil(amount * gnomeMultiplier()))
        coins += Double(earned)
        totalCoinsEarned += earned
        return earned
    }

    func addXP(_ amount: Int) {
        xp += amount
        let needed = 100 * level
        if xp >= needed {
            xp -= needed
            level += 1
            maxWater = min(20, 10 + level / 2)
            showToast("🎉 Level \(level)! Max water increased!")
        }
    }

    func growthProgress(for tile: GardenTile) -> Double {
        guard let id = tile.itemId, let item = findItem(id),
              item.growTime > 0, let start = tile.growthStart else { return 1 }
        let elapsed = Date().timeIntervalSince(start) * (tile.watered ? 1.5 : 1.0)
        return min(1, elapsed / item.growTime)
    }

    func isReady(_ tile: GardenTile) -> Bool { growthProgress(for: tile) >= 1 }

    func showToast(_ msg: String) {
        toastWork?.cancel()
        toastMessage = msg
        let w = DispatchWorkItem { [weak self] in self?.toastMessage = "" }
        toastWork = w
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5, execute: w)
    }

    // MARK: - Actions

    func buyItem(_ itemId: String) {
        guard let item = findItem(itemId), coins >= Double(item.cost) else { return }
        coins -= Double(item.cost)
        inventory[itemId, default: 0] += 1
        addXP(max(1, item.xp / 10))
        showToast("Bought \(item.emoji) \(item.name)!")
        save()
    }

    func placeItem(_ itemId: String, at idx: Int) {
        guard idx < tiles.count, tiles[idx].itemId == nil else { showToast("Tile is occupied!"); return }
        guard (inventory[itemId] ?? 0) > 0, let item = findItem(itemId) else { return }
        inventory[itemId]! -= 1
        if inventory[itemId] == 0 { inventory.removeValue(forKey: itemId) }
        tiles[idx].itemId = itemId
        tiles[idx].growthStart = Date()
        tiles[idx].watered = false
        tiles[idx].lastRewardAt = Date()
        addXP(item.xp)
        showToast("\(item.emoji) \(item.name) placed!")
        save()
    }

    func waterTile(at idx: Int) {
        guard water > 0 else { showToast("No water left! Refills over time."); return }
        guard !tiles[idx].watered else { showToast("Already watered!"); return }
        water -= 1
        tiles[idx].watered = true
        showToast("💧 Watered! Growth +50%")
        save()
    }

    func harvestTile(at idx: Int) {
        guard let id = tiles[idx].itemId, let item = findItem(id),
              isReady(tiles[idx]) else { showToast("Not ready yet!"); return }
        let earned = addCoins(Double(item.reward))
        addXP(item.xp)
        plantsHarvested += 1
        tiles[idx].growthStart = Date()
        tiles[idx].watered = false
        showToast("🌻 Harvested! +\(earned) coins")
        save()
    }

    func removeTile(at idx: Int) {
        guard let id = tiles[idx].itemId, let item = findItem(id) else { return }
        if item.isDecor || item.isGnome || item.isTree {
            inventory[id, default: 0] += 1
            showToast("\(item.emoji) Returned to bag")
        } else {
            showToast("\(item.emoji) Removed")
        }
        tiles[idx] = GardenTile(id: tiles[idx].id)
        save()
    }

    func buyExpansion(_ expLevel: Int) {
        guard let exp = allExpansions.first(where: { $0.id == expLevel }) else { return }
        guard expansionLevel == expLevel - 1 else {
            showToast(expansionLevel >= expLevel ? "Already purchased!" : "Unlock previous expansion first!")
            return
        }
        guard coins >= Double(exp.cost) else { showToast("Need 🌻 \(exp.cost) coins"); return }
        coins -= Double(exp.cost)
        expansionLevel = expLevel
        let start = tiles.count
        for i in 0..<4 { tiles.append(GardenTile(id: start + i)) }
        addXP(50)
        showToast("\(exp.emoji) \(exp.name) unlocked! +4 plots")
        save()
    }

    // MARK: - Persistence

    private struct SaveData: Codable {
        var coins: Double; var water, maxWater, xp, level: Int
        var totalCoinsEarned, plantsHarvested, expansionLevel: Int
        var tiles: [GardenTile]; var inventory: [String: Int]
        var waterTimer: Double; var lastTick: Date
    }

    func save() {
        let d = SaveData(coins: coins, water: water, maxWater: maxWater,
                         xp: xp, level: level, totalCoinsEarned: totalCoinsEarned,
                         plantsHarvested: plantsHarvested, expansionLevel: expansionLevel,
                         tiles: tiles, inventory: inventory,
                         waterTimer: waterTimer, lastTick: lastTick)
        if let encoded = try? JSONEncoder().encode(d) {
            UserDefaults.standard.set(encoded, forKey: "idleGarden_v1")
        }
    }

    func load() {
        guard let raw = UserDefaults.standard.data(forKey: "idleGarden_v1"),
              let d = try? JSONDecoder().decode(SaveData.self, from: raw) else { return }
        coins = d.coins; water = d.water; maxWater = d.maxWater
        xp = d.xp; level = d.level; totalCoinsEarned = d.totalCoinsEarned
        plantsHarvested = d.plantsHarvested; expansionLevel = d.expansionLevel
        inventory = d.inventory; waterTimer = d.waterTimer; lastTick = d.lastTick
        if d.tiles.count >= 16 { tiles = d.tiles }
    }
}
