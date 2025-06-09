// /types/inventory.ts

export interface ApiEntry {
  item: { _id: string; name: string };
  openingQty: number;
  soldQty: number;
  closingQty: number;
}

export interface ApiReport {
  vendor: { _id: string; fullName: string };
  date: string;
  retailEntries: ApiEntry[];
  produceEntries: ApiEntry[];
  // ...you can add rawEntries etc later
}

export interface InventoryItem {
  name: string;
  opening: number;
  received: number;
  sold: number;
  closing: number;
  itemType: "Retail" | "Produce";
}

export interface InventoryStats {
  totalTracked: number;
  soldToday: number;
  receivedToday: number;
}

export function transformApiReport(r: ApiReport) {
  const retailItems: InventoryItem[] = r.retailEntries.map((e) => ({
    name: e.item.name,
    opening: e.openingQty,
    sold: e.soldQty,
    closing: e.closingQty,
    // received = closing − opening + sold
    received: e.closingQty - e.openingQty + e.soldQty,
    itemType: "Retail",
  }));
  const produceItems: InventoryItem[] = r.produceEntries.map((e) => ({
    name: e.item.name,
    opening: 0,
    sold: e.soldQty,
    closing: 0,
    received: 0,
    itemType: "Produce",
  }));
  const items = [...retailItems, ...produceItems];

  const stats: InventoryStats = {
    totalTracked: items.length,
    soldToday: items.reduce((sum, i) => sum + i.sold, 0),
    receivedToday: items.reduce((sum, i) => sum + i.received, 0),
  };

  return {
    items,
    stats,
    reportDate: r.date,
    vendorName: r.vendor.fullName,
    vendorId: r.vendor._id,
  };
}

export interface InventoryReport {
  items: InventoryItem[];
  stats: InventoryStats;
  reportDate: string;
  vendorName: string;
  vendorId: string;
}
