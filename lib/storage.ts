import { seedStore } from "./seed";
import { Store } from "./types";

export const STORE_KEY = "wd-cloudlab-store-v1";
export const SESSION_KEY = "wd-cloudlab-session";
const SCHEMA_VERSION = 2;

function migrate(store: Store): Store {
  if (store.schemaVersion === 1) {
    return {
      ...store,
      schemaVersion: SCHEMA_VERSION,
      users: store.users.map(user => {
        if (user.id === "u-customer") return { ...user, name: "Mainak Mondal", company: "CloudLab Customer" };
        if (user.id === "u-employee") return { ...user, name: "Jacob Konnick" };
        if (user.id === "u-admin") return { ...user, name: "Kelly Xiao" };
        return user;
      })
    };
  }
  return store;
}

export function loadStore(): Store {
  if (typeof window === "undefined") return seedStore();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return seedAndSave();
    const parsed = JSON.parse(raw) as Store;
    if (!Array.isArray(parsed.services) || !Array.isArray(parsed.users)) return seedAndSave();
    const migrated = migrate(parsed);
    if (migrated.schemaVersion !== SCHEMA_VERSION) return seedAndSave();
    if (migrated !== parsed) saveStore(migrated);
    return migrated;
  } catch {
    return seedAndSave();
  }
}

export function saveStore(store: Store) { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
export function seedAndSave() { const store = seedStore(); if (typeof window !== "undefined") saveStore(store); return store; }
export function getSession() { if (typeof window === "undefined") return null; try { return localStorage.getItem(SESSION_KEY); } catch { return null; } }
export function setSession(id: string | null) { if (id) localStorage.setItem(SESSION_KEY, id); else localStorage.removeItem(SESSION_KEY); }
