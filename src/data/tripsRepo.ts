import type { Trip, TripType } from "../app/navigation/types";
import { getDb } from "./db";

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function listTrips(): Promise<Trip[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM trips ORDER BY updated_at DESC;`
  );

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    startDate: r.start_date,
    endDate: r.end_date,
    tripType: r.trip_type as TripType,
    groupSize: r.group_size,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  const db = await getDb();
  const r = await db.getFirstAsync<any>(
    `SELECT * FROM trips WHERE id = ? LIMIT 1;`,
    [tripId]
  );

  if (!r) return null;

  return {
    id: r.id,
    name: r.name,
    startDate: r.start_date,
    endDate: r.end_date,
    tripType: r.trip_type as TripType,
    groupSize: r.group_size,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function createTrip(input: {
  name: string;
  startDate: string;
  endDate: string;
  tripType: TripType;
  groupSize: number;
}): Promise<string> {
  const db = await getDb();
  const id = makeId();
  const ts = nowIso();

  await db.runAsync(
    `INSERT INTO trips (id, name, start_date, end_date, trip_type, group_size, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      input.name,
      input.startDate,
      input.endDate,
      input.tripType,
      input.groupSize,
      ts,
      ts,
    ]
  );

  return id;
}
