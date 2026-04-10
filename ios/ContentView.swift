import SwiftUI

// MARK: - Colors

extension Color {
    static let gardenGreen = Color(red: 0.251, green: 0.569, blue: 0.424)
    static let gardenDark  = Color(red: 0.176, green: 0.416, blue: 0.310)
    static let soilBrown   = Color(red: 0.420, green: 0.259, blue: 0.149)
    static let soilLight   = Color(red: 0.545, green: 0.369, blue: 0.235)
    static let skyMint     = Color(red: 0.718, green: 0.894, blue: 0.780)
}

struct TileIndex: Identifiable { let id: Int }

// MARK: - Root

struct ContentView: View {
    @StateObject private var game = GameState()
    @State private var selectedTab = 0
    @State private var selectedInvItemId: String? = nil

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $selectedTab) {
                GardenView(game: game, selectedInvItemId: $selectedInvItemId)
                    .tabItem { Label("Garden", systemImage: "leaf.fill") }.tag(0)
                ShopView(game: game)
                    .tabItem { Label("Shop", systemImage: "cart.fill") }.tag(1)
                InventoryView(game: game, selectedInvItemId: $selectedInvItemId, selectedTab: $selectedTab)
                    .tabItem { Label("Bag", systemImage: "bag.fill") }.tag(2)
                StatsView(game: game)
                    .tabItem { Label("Progress", systemImage: "star.fill") }.tag(3)
            }
            .accentColor(.gardenGreen)

            if !game.toastMessage.isEmpty {
                Text(game.toastMessage)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 16).padding(.vertical, 10)
                    .background(Color.black.opacity(0.82))
                    .clipShape(Capsule())
                    .padding(.bottom, 90)
                    .transition(.opacity)
                    .animation(.easeInOut(duration: 0.25), value: game.toastMessage)
            }
        }
    }
}

// MARK: - Garden

struct GardenView: View {
    @ObservedObject var game: GameState
    @Binding var selectedInvItemId: String?
    @State private var tileSheet: TileIndex? = nil

    private let cols = Array(repeating: GridItem(.flexible(), spacing: 8), count: 4)

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                HStack(spacing: 14) {
                    Label("\(Int(game.coins))", systemImage: "sun.max.fill")
                    Label("\(game.water)/\(game.maxWater)", systemImage: "drop.fill")
                }
                .font(.system(size: 15, weight: .semibold)).foregroundColor(.white)
                Spacer()
                Text("Lvl \(game.level)")
                    .font(.system(size: 13, weight: .bold)).foregroundColor(.white)
                    .padding(.horizontal, 10).padding(.vertical, 4)
                    .background(Color.white.opacity(0.2)).clipShape(Capsule())
            }
            .padding(.horizontal, 16).padding(.vertical, 10)
            .background(LinearGradient(colors: [.gardenDark, .gardenGreen],
                                       startPoint: .leading, endPoint: .trailing))

            if let invId = selectedInvItemId, let item = findItem(invId) {
                HStack {
                    Text("\(item.emoji) Tap a tile to place \(item.name)")
                        .font(.system(size: 13, weight: .semibold)).foregroundColor(.gardenDark)
                    Spacer()
                    Button("Cancel") { selectedInvItemId = nil }
                        .font(.system(size: 13, weight: .bold)).foregroundColor(.red)
                }
                .padding(.horizontal, 14).padding(.vertical, 8)
                .background(Color.yellow.opacity(0.25))
            }

            ScrollView {
                LazyVGrid(columns: cols, spacing: 8) {
                    ForEach(game.tiles.indices, id: \.self) { idx in
                        GardenTileView(game: game, idx: idx, isPlacing: selectedInvItemId != nil)
                            .onTapGesture {
                                if let invId = selectedInvItemId {
                                    game.placeItem(invId, at: idx)
                                    selectedInvItemId = nil
                                } else if game.isReady(game.tiles[idx]),
                                          let id = game.tiles[idx].itemId,
                                          let item = findItem(id), item.growTime > 0 {
                                    game.harvestTile(at: idx)
                                } else {
                                    tileSheet = TileIndex(id: idx)
                                }
                            }
                    }
                }
                .padding(12)
            }
            .background(Color.skyMint)
        }
        .sheet(item: $tileSheet) { ti in
            TileActionSheet(game: game, idx: ti.id)
                .modify {
                    if #available(iOS 16, *) { $0.presentationDetents([.medium, .large]) }
                    else { $0 }
                }
        }
    }
}

// MARK: - Garden Tile

struct GardenTileView: View {
    @ObservedObject var game: GameState
    let idx: Int
    let isPlacing: Bool

    var tile: GardenTile { game.tiles[idx] }
    var item: CatalogItem? { tile.itemId.flatMap(findItem) }
    var progress: Double { game.growthProgress(for: tile) }
    var ready: Bool { game.isReady(tile) }

    var body: some View {
        ZStack(alignment: .bottom) {
            RoundedRectangle(cornerRadius: 12)
                .fill(item != nil ? Color.soilBrown : Color.soilLight)
                .shadow(color: .black.opacity(0.25), radius: 0, x: 0, y: 3)

            if isPlacing {
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(Color.yellow, style: StrokeStyle(lineWidth: 2, dash: [5]))
            } else if item == nil {
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(Color.white.opacity(0.25), style: StrokeStyle(lineWidth: 1.5, dash: [4]))
            }

            VStack(spacing: 2) {
                if let item {
                    Text(item.emoji).font(.system(size: 28))
                    Text(item.name)
                        .font(.system(size: 8, weight: .semibold))
                        .foregroundColor(.white.opacity(0.85)).lineLimit(1)
                } else {
                    Image(systemName: "plus")
                        .font(.system(size: 16, weight: .light))
                        .foregroundColor(.white.opacity(0.3))
                }
            }
            .padding(.vertical, 8).padding(.horizontal, 4)

            if let item, item.growTime > 0 {
                GeometryReader { geo in
                    VStack {
                        Spacer()
                        ZStack(alignment: .leading) {
                            Capsule().fill(Color.black.opacity(0.3)).frame(height: 4)
                            Capsule()
                                .fill(LinearGradient(colors: [.green, .yellow],
                                                     startPoint: .leading, endPoint: .trailing))
                                .frame(width: max(0, geo.size.width * CGFloat(progress)), height: 4)
                        }
                        .padding(.horizontal, 6).padding(.bottom, 5)
                    }
                }
            }

            if let item, item.growTime > 0, !tile.watered, !ready {
                VStack {
                    HStack { Spacer(); Text("💧").font(.system(size: 10)).padding(3) }
                    Spacer()
                }
            }
        }
        .aspectRatio(1, contentMode: .fit)
    }
}

// MARK: - Tile Action Sheet

struct TileActionSheet: View {
    @ObservedObject var game: GameState
    let idx: Int
    @Environment(\.dismiss) private var dismiss

    var tile: GardenTile { game.tiles[idx] }
    var item: CatalogItem? { tile.itemId.flatMap(findItem) }
    var progress: Double { game.growthProgress(for: tile) }
    var ready: Bool { game.isReady(tile) }
    var invItems: [(String, Int)] { game.inventory.filter { $0.value > 0 }.sorted { $0.key < $1.key } }

    var body: some View {
        VStack(spacing: 0) {
            Capsule().fill(Color.secondary.opacity(0.35))
                .frame(width: 36, height: 4).padding(.top, 10).padding(.bottom, 16)
            if let item { occupiedView(item) } else { emptyView }
        }
    }

    @ViewBuilder
    func occupiedView(_ item: CatalogItem) -> some View {
        Text(item.emoji).font(.system(size: 52))
        Text(item.name).font(.title2.bold()).foregroundColor(.gardenDark)
        Group {
            if item.growTime == 0     { Text("Permanent decoration") }
            else if ready             { Text("✅ Ready to harvest!") }
            else                      { Text("Growing… \(Int(progress * 100))%") }
        }
        .font(.subheadline).foregroundColor(.secondary).padding(.bottom, 20)

        VStack(spacing: 10) {
            if item.growTime > 0, !ready {
                actionBtn(tile.watered ? "Already watered" : "💧 Water (\(game.water) left)",
                          color: (tile.watered || game.water == 0) ? .gray.opacity(0.35) : .blue.opacity(0.8),
                          disabled: tile.watered || game.water == 0)
                { game.waterTile(at: idx); dismiss() }
            }
            if item.growTime > 0, ready {
                actionBtn("🌻 Harvest (+\(item.reward) coins)", color: .gardenGreen)
                { game.harvestTile(at: idx); dismiss() }
            }
            actionBtn("🗑️ Remove", color: .red.opacity(0.85)) { game.removeTile(at: idx); dismiss() }
            closeBtn
        }
        .padding(.horizontal, 16)
        Spacer(minLength: 20)
    }

    var emptyView: some View {
        VStack(spacing: 0) {
            Text("🌱").font(.system(size: 52))
            Text("Empty Plot").font(.title2.bold()).foregroundColor(.gardenDark)
            Text(invItems.isEmpty ? "Buy items from the Shop first!" : "Choose what to plant:")
                .font(.subheadline).foregroundColor(.secondary).padding(.bottom, 12)
            if invItems.isEmpty {
                closeBtn.padding(.horizontal, 16)
            } else {
                ScrollView {
                    VStack(spacing: 8) {
                        ForEach(invItems, id: \.0) { (id, count) in
                            if let ci = findItem(id) {
                                Button { game.placeItem(id, at: idx); dismiss() } label: {
                                    HStack {
                                        Text(ci.emoji).font(.title2)
                                        Text("\(ci.name) (×\(count))")
                                            .font(.system(size: 15, weight: .semibold))
                                        Spacer()
                                        Image(systemName: "plus.circle.fill").foregroundColor(.gardenGreen)
                                    }
                                    .padding(.horizontal, 14).padding(.vertical, 12)
                                    .background(Color.white).cornerRadius(12)
                                    .shadow(color: .black.opacity(0.05), radius: 4)
                                }
                                .foregroundColor(.primary)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                }
                closeBtn.padding(.horizontal, 16).padding(.top, 8)
            }
            Spacer(minLength: 20)
        }
    }

    func actionBtn(_ title: String, color: Color, disabled: Bool = false, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title).frame(maxWidth: .infinity).padding(.vertical, 13)
                .background(color).foregroundColor(.white).cornerRadius(12)
                .font(.system(size: 15, weight: .semibold))
        }.disabled(disabled)
    }

    var closeBtn: some View {
        Button("Close") { dismiss() }
            .frame(maxWidth: .infinity).padding(.vertical, 12)
            .background(Color(.systemGray5)).cornerRadius(12)
            .font(.system(size: 14, weight: .semibold)).foregroundColor(.secondary)
    }
}

// MARK: - Shop

enum ShopCat: String, CaseIterable {
    case plants = "Plants", trees = "Trees", decor = "Decor", gnomes = "Gnomes", land = "Land"
    var emoji: String {
        switch self {
        case .plants: return "🌱"; case .trees: return "🌳"; case .decor: return "🪨"
        case .gnomes: return "🧙"; case .land: return "🏡"
        }
    }
    var items: [CatalogItem] {
        switch self {
        case .plants: return plantItems; case .trees: return treeItems
        case .decor: return decorItems; case .gnomes: return gnomeItems; case .land: return []
        }
    }
}

struct ShopView: View {
    @ObservedObject var game: GameState
    @State private var cat: ShopCat = .plants
    private let cols = Array(repeating: GridItem(.flexible(), spacing: 10), count: 3)

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(ShopCat.allCases, id: \.self) { c in
                            Button { cat = c } label: {
                                Text("\(c.emoji) \(c.rawValue)")
                                    .font(.system(size: 13, weight: .bold))
                                    .padding(.horizontal, 14).padding(.vertical, 8)
                                    .background(cat == c ? Color.gardenGreen : Color(.systemGray5))
                                    .foregroundColor(cat == c ? .white : .secondary)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                    .padding(.horizontal, 12).padding(.vertical, 10)
                }
                ScrollView {
                    if cat == .land {
                        VStack(spacing: 12) {
                            ForEach(allExpansions) { exp in ExpansionCard(game: game, exp: exp) }
                        }.padding(12)
                    } else {
                        LazyVGrid(columns: cols, spacing: 10) {
                            ForEach(cat.items) { item in ShopItemCard(game: game, item: item) }
                        }.padding(12)
                    }
                }
            }
            .navigationTitle("Garden Shop").navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(.stack)
    }
}

struct ShopItemCard: View {
    @ObservedObject var game: GameState
    let item: CatalogItem
    var canAfford: Bool { game.coins >= Double(item.cost) }

    var body: some View {
        Button { game.buyItem(item.id) } label: {
            VStack(spacing: 4) {
                Text(item.emoji).font(.system(size: 30))
                Text(item.name).font(.system(size: 11, weight: .semibold))
                    .foregroundColor(.primary).lineLimit(1)
                HStack(spacing: 2) {
                    Text("🌻").font(.system(size: 10))
                    Text("\(item.cost)").font(.system(size: 11, weight: .bold)).foregroundColor(.brown)
                }
            }
            .frame(maxWidth: .infinity).padding(.vertical, 10)
            .background(Color.white).cornerRadius(12)
            .shadow(color: .black.opacity(0.07), radius: 4)
            .opacity(canAfford ? 1 : 0.5)
        }.disabled(!canAfford)
    }
}

struct ExpansionCard: View {
    @ObservedObject var game: GameState
    let exp: Expansion
    var purchased: Bool { game.expansionLevel >= exp.id }
    var locked: Bool    { game.expansionLevel < exp.id - 1 }
    var canAfford: Bool { game.coins >= Double(exp.cost) }

    var body: some View {
        Button { game.buyExpansion(exp.id) } label: {
            HStack(spacing: 14) {
                Text(exp.emoji).font(.system(size: 32))
                VStack(alignment: .leading, spacing: 3) {
                    Text(exp.name).font(.system(size: 15, weight: .bold)).foregroundColor(.primary)
                    Text(exp.desc).font(.system(size: 12)).foregroundColor(.secondary)
                }
                Spacer()
                Group {
                    if purchased {
                        Label("Owned", systemImage: "checkmark.circle.fill")
                            .font(.system(size: 12, weight: .bold)).foregroundColor(.gardenGreen)
                            .padding(.horizontal, 10).padding(.vertical, 6)
                            .background(Color.gardenGreen.opacity(0.12)).cornerRadius(20)
                    } else if locked {
                        Label("Locked", systemImage: "lock.fill")
                            .font(.system(size: 12, weight: .semibold)).foregroundColor(.secondary)
                            .padding(.horizontal, 10).padding(.vertical, 6)
                            .background(Color(.systemGray5)).cornerRadius(20)
                    } else {
                        HStack(spacing: 2) {
                            Text("🌻")
                            Text("\(exp.cost)").font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(canAfford ? .white : .secondary)
                        .padding(.horizontal, 12).padding(.vertical, 8)
                        .background(canAfford ? Color.gardenGreen : Color(.systemGray4))
                        .cornerRadius(20)
                    }
                }
            }
            .padding(14)
            .background(purchased ? Color.gardenGreen.opacity(0.08) : Color.white)
            .cornerRadius(14).shadow(color: .black.opacity(0.07), radius: 4)
        }
        .disabled(purchased || locked).opacity(locked ? 0.5 : 1)
    }
}

// MARK: - Inventory

struct InventoryView: View {
    @ObservedObject var game: GameState
    @Binding var selectedInvItemId: String?
    @Binding var selectedTab: Int
    private let cols = Array(repeating: GridItem(.flexible(), spacing: 10), count: 3)
    var invItems: [(String, Int)] { game.inventory.filter { $0.value > 0 }.sorted { $0.key < $1.key } }

    var body: some View {
        NavigationView {
            Group {
                if invItems.isEmpty {
                    VStack(spacing: 12) {
                        Text("🎒").font(.system(size: 52))
                        Text("Bag is empty").font(.headline).foregroundColor(.secondary)
                        Text("Visit the Shop to buy items.").font(.subheadline).foregroundColor(.secondary)
                    }.frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    ScrollView {
                        if selectedInvItemId != nil {
                            HStack {
                                Image(systemName: "info.circle").foregroundColor(.gardenDark)
                                Text("Select an item then go to Garden to place it.")
                                    .font(.system(size: 13)).foregroundColor(.gardenDark)
                            }
                            .padding(10).frame(maxWidth: .infinity)
                            .background(Color.yellow.opacity(0.2))
                            .padding(.horizontal, 12).padding(.top, 8)
                        }
                        LazyVGrid(columns: cols, spacing: 10) {
                            ForEach(invItems, id: \.0) { (id, count) in
                                if let item = findItem(id) {
                                    InventoryCard(item: item, count: count, selected: selectedInvItemId == id) {
                                        if selectedInvItemId == id { selectedInvItemId = nil }
                                        else { selectedInvItemId = id; selectedTab = 0 }
                                    }
                                }
                            }
                        }.padding(12)
                    }
                }
            }
            .navigationTitle("Your Bag").navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(.stack)
    }
}

struct InventoryCard: View {
    let item: CatalogItem; let count: Int; let selected: Bool; let onTap: () -> Void
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 4) {
                Text(item.emoji).font(.system(size: 30))
                Text(item.name).font(.system(size: 11, weight: .semibold))
                    .foregroundColor(.primary).lineLimit(1)
                Text("×\(count)").font(.system(size: 11, weight: .bold)).foregroundColor(.gardenDark)
                    .padding(.horizontal, 8).padding(.vertical, 2)
                    .background(Color.gardenGreen.opacity(0.15)).cornerRadius(8)
            }
            .frame(maxWidth: .infinity).padding(.vertical, 10).background(Color.white).cornerRadius(12)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(selected ? Color.gardenGreen : .clear, lineWidth: 2))
            .shadow(color: .black.opacity(0.07), radius: 4)
        }
    }
}

// MARK: - Stats

struct StatsView: View {
    @ObservedObject var game: GameState
    var xpNeeded: Int { 100 * game.level }
    var xpPct: Double { Double(game.xp) / Double(xpNeeded) }
    var gnomePct: Int { Int((game.gnomeMultiplier() - 1) * 100) }

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    VStack(spacing: 8) {
                        Text("🌻").font(.system(size: 48))
                        Text("Level \(game.level)").font(.title.bold()).foregroundColor(.gardenDark)
                        GeometryReader { geo in
                            ZStack(alignment: .leading) {
                                Capsule().fill(Color(.systemGray5)).frame(height: 10)
                                Capsule()
                                    .fill(LinearGradient(colors: [.gardenGreen, Color(red:0.45,green:0.8,blue:0.6)],
                                                         startPoint: .leading, endPoint: .trailing))
                                    .frame(width: geo.size.width * CGFloat(xpPct), height: 10)
                            }
                        }.frame(height: 10)
                        Text("\(game.xp) / \(xpNeeded) XP").font(.caption).foregroundColor(.secondary)
                    }
                    .padding(20).background(Color.white).cornerRadius(16)
                    .shadow(color: .black.opacity(0.07), radius: 6)

                    VStack(spacing: 0) {
                        statRow("Total Coins Earned", "🌻 \(game.totalCoinsEarned)")
                        Divider().padding(.horizontal, 16)
                        statRow("Plants Harvested", "\(game.plantsHarvested)")
                        Divider().padding(.horizontal, 16)
                        statRow("Garden Plots", "🏡 \(game.tiles.count)")
                        Divider().padding(.horizontal, 16)
                        statRow("Water Capacity", "💧 \(game.maxWater)")
                        Divider().padding(.horizontal, 16)
                        statRow("Gnome Bonus", "+\(gnomePct)%")
                    }
                    .background(Color.white).cornerRadius(16)
                    .shadow(color: .black.opacity(0.07), radius: 6)
                }
                .padding(16)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Progress").navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(.stack)
    }

    func statRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).foregroundColor(.secondary)
            Spacer()
            Text(value).fontWeight(.semibold).foregroundColor(.gardenDark)
        }
        .padding(.horizontal, 16).padding(.vertical, 12).font(.system(size: 14))
    }
}

// MARK: - Helpers

extension View {
    @ViewBuilder
    func modify<T: View>(@ViewBuilder _ transform: (Self) -> T) -> some View {
        transform(self)
    }
}
