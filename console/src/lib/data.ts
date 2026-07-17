import { promises as fs } from "fs";
import path from "path";
import type { ConsoleData } from "./types";

let cache: ConsoleData | null = null;
let cacheStamp = 0;
const CACHE_MS = 5_000;

const SEED_PATHS = [
  path.join(process.cwd(), "..", "seed", "console_data.json"),
  path.join(process.cwd(), "seed", "console_data.json"),
  "C:/Users/juan/OneDrive/Documents/GitHub/LifeGuard/seed/console_data.json",
];

async function findSeed(): Promise<string> {
  for (const p of SEED_PATHS) {
    try {
      const stat = await fs.stat(p);
      if (stat.isFile()) return p;
    } catch {
      // continue
    }
  }
  // Fallback to first path; caller will catch ENOENT and use inline fallback.
  return SEED_PATHS[0];
}

export async function loadData(): Promise<ConsoleData> {
  const now = Date.now();
  if (cache && now - cacheStamp < CACHE_MS) return cache;

  const seedPath = await findSeed();
  try {
    const raw = await fs.readFile(seedPath, "utf-8");
    cache = JSON.parse(raw) as ConsoleData;
    cacheStamp = now;
    return cache;
  } catch {
    // Seed not present — fall back to inline data so the console still renders.
    cache = inlineData();
    cacheStamp = now;
    return cache;
  }
}

// Inline fallback so /api routes never throw when the seed file is missing.
function inlineData(): ConsoleData {
  const now = new Date("2026-07-17T12:00:00Z").toISOString();
  return {
    meta: { generated_at: now, region: "Sandton / Rosebank / Parkhurst — Johannesburg, ZA", operator: "CityWatch Armed Response", shift: "Day shift 06:00–18:00 SAST" },
    devices: [],
    responders: [],
    incidents: [],
    subscribers: [],
    shifts: [],
    handoff_notes: [],
    audit: [],
    broadcasts: [],
    stats: { subscribers_total: 0, subscribers_online: 0, open_incidents: 0, incidents_today: 0, incidents_acked_in_30s_pct: 0, responders_available: 0, responders_dispatched: 0, responders_on_scene: 0, avg_response_min: 0 },
  };
}

export function getSubscriber(id: string, data: ConsoleData) {
  return data.subscribers.find((s) => s.id === id);
}

export function getDevice(id: string, data: ConsoleData) {
  return data.devices.find((d) => d.id === id);
}

export function getIncident(id: string, data: ConsoleData) {
  return data.incidents.find((i) => i.id === id);
}

export function getResponder(id: string, data: ConsoleData) {
  return data.responders.find((r) => r.id === id);
}
