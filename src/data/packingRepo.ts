import { getDb } from "./db";
import type { TemplateItem } from "./seedTemplates";

export type PackingItemRow = {
  id: string;
  tripId: string;
  name: string;
  category: string;
  quantity: number;
  packed: 0 | 1;
  note: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function countPackingItems(tripId: string): Promise<number> {
  const db = await getDb();
  const r = await db.getFirstAsync<any>(
    `SELECT COUNT(1) as cnt FROM packing_items WHERE trip_id = ?;`,
    [tripId],
  );
  return (r?.cnt ?? 0) as number;
}

export async function listPackingItems(
  tripId: string,
): Promise<PackingItemRow[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM packing_items
     WHERE trip_id = ?
     ORDER BY category ASC, sort_order ASC, name ASC;`,
    [tripId],
  );

  return rows.map((r) => ({
    id: r.id,
    tripId: r.trip_id,
    name: r.name,
    category: r.category,
    quantity: r.quantity,
    packed: (r.packed ?? 0) as 0 | 1,
    note: r.note ?? null,
    sortOrder: r.sort_order ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function togglePacked(
  itemId: string,
  packed: boolean,
): Promise<void> {
  const db = await getDb();
  const ts = nowIso();
  await db.runAsync(
    `UPDATE packing_items SET packed = ?, updated_at = ? WHERE id = ?;`,
    [packed ? 1 : 0, ts, itemId],
  );
}

export async function applyTemplateToTrip(
  tripId: string,
  items: TemplateItem[],
): Promise<void> {
  const db = await getDb();
  const ts = nowIso();

  // One transaction-ish block: begin/commit
  await db.execAsync("BEGIN TRANSACTION;");
  try {
    for (const it of items) {
      await db.runAsync(
        `INSERT INTO packing_items
          (id, trip_id, name, category, quantity, packed, note, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          makeId(),
          tripId,
          it.name,
          it.category,
          it.quantity ?? 1,
          0,
          it.note ?? null,
          it.sortOrder ?? 0,
          ts,
          ts,
        ],
      );
    }
    await db.execAsync("COMMIT;");
  } catch (e) {
    await db.execAsync("ROLLBACK;");
    throw e;
  }
}
