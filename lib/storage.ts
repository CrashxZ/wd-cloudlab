import { seedStore } from "./seed";
import { Store } from "./types";

export const STORE_KEY="wd-cloudlab-store-v1";
export const SESSION_KEY="wd-cloudlab-session";
export function loadStore():Store{
  if(typeof window==="undefined")return seedStore();
  try{const raw=localStorage.getItem(STORE_KEY);if(!raw)return seedAndSave();const parsed=JSON.parse(raw) as Store;if(parsed.schemaVersion!==1||!Array.isArray(parsed.services))return seedAndSave();return parsed;}catch{return seedAndSave();}
}
export function saveStore(store:Store){localStorage.setItem(STORE_KEY,JSON.stringify(store));}
export function seedAndSave(){const s=seedStore();if(typeof window!=="undefined")saveStore(s);return s;}
export function getSession(){if(typeof window==="undefined")return null;try{return localStorage.getItem(SESSION_KEY);}catch{return null;}}
export function setSession(id:string|null){if(id)localStorage.setItem(SESSION_KEY,id);else localStorage.removeItem(SESSION_KEY);}
