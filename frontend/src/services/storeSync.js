import bcrypt from "bcryptjs";
import appConfig from "../config/appConfig";
import { supabase, isSupabaseConfigured } from "../config/supabaseClient";
import { COLLECTIONS } from "./collections.config";

// Keys that mirror the localStorage collections used across the app. These are
// the same keys defined in localStore.js.
export const SYNC_KEYS = Object.keys(COLLECTIONS);

let backendAvailable = false;

export const isBackendAvailable = () => backendAvailable;

// --------------------------------------------------------------------------
// Value casting + row <-> JS mapping helpers
// --------------------------------------------------------------------------
const castFromDb = (value, type) => {
  if (value === null || value === undefined) return value;
  if (type === "int") return Number.parseInt(value, 10);
  if (type === "numeric") return Number(value);
  if (type === "json") {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }
    return value;
  }
  return value;
};

const castToDb = (value, type) => {
  if (value === undefined) return null;
  if (value === null) return null;
  if (type === "int") {
    const n = Number.parseInt(value, 10);
    return Number.isNaN(n) ? null : n;
  }
  if (type === "numeric") {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
  if (type === "json") return value; // supabase-js serialises jsonb
  return value;
};

// Convert a database row into the camelCase JS object the screens expect.
// Password columns are never copied to the client.
const rowToJs = (config, row) => {
  const item = {};
  config.fields.forEach(([jsField, dbColumn, type]) => {
    item[jsField] = castFromDb(row[dbColumn], type);
  });
  return item;
};

// Convert a JS object into a database row. When includePassword is true and the
// item carries a plaintext password, it is bcrypt-hashed into the password
// column. When false, the password column is omitted so an upsert preserves the
// existing hash on update.
const jsToRow = (config, item, includePassword) => {
  const row = {};
  config.fields.forEach(([jsField, dbColumn, type]) => {
    row[dbColumn] = castToDb(item[jsField], type);
  });
  if (config.password && includePassword) {
    const plain = item[config.password.js];
    if (plain) {
      row[config.password.col] = bcrypt.hashSync(String(plain), 10);
    }
  }
  return row;
};

const hasPlainPassword = (config, item) =>
  Boolean(config.password && item[config.password.js]);

// --------------------------------------------------------------------------
// Supabase implementation
// --------------------------------------------------------------------------
const hydrateOneFromSupabase = async (key) => {
  const config = COLLECTIONS[key];
  if (!config) return;

  if (config.isStringList) {
    const { data, error } = await supabase.from(config.table).select(config.column);
    if (error) throw error;
    const list = (data || []).map((r) => r[config.column]);
    localStorage.setItem(key, JSON.stringify(list));
    return;
  }

  const { data, error } = await supabase.from(config.table).select("*");
  if (error) throw error;
  const items = (data || []).map((row) => rowToJs(config, row));
  localStorage.setItem(key, JSON.stringify(items));
};

const hydrateFromSupabase = async () => {
  // Run all collections; if any fail we still try the rest.
  const results = await Promise.allSettled(
    SYNC_KEYS.map((key) => hydrateOneFromSupabase(key)),
  );
  const anyOk = results.some((r) => r.status === "fulfilled");
  backendAvailable = anyOk;
  return anyOk;
};

const pushStringListToSupabase = async (config, value) => {
  const names = Array.isArray(value) ? value.filter(Boolean) : [];
  // Remove rows no longer present, then add any new ones.
  const { data: existing } = await supabase.from(config.table).select(config.column);
  const existingNames = (existing || []).map((r) => r[config.column]);
  const toDelete = existingNames.filter((n) => !names.includes(n));
  if (toDelete.length) {
    await supabase.from(config.table).delete().in(config.column, toDelete);
  }
  if (names.length) {
    await supabase
      .from(config.table)
      .upsert(names.map((n) => ({ [config.column]: n })), {
        onConflict: config.column,
      });
  }
};

const pushCollectionToSupabase = async (config, value) => {
  const items = Array.isArray(value) ? value : [];
  const idField = config.idField;
  const idType = config.idType || "text";

  const withPassword = [];
  const withoutPassword = [];
  items.forEach((item) => {
    if (hasPlainPassword(config, item)) {
      withPassword.push(jsToRow(config, item, true));
    } else {
      withoutPassword.push(jsToRow(config, item, false));
    }
  });

  if (withoutPassword.length) {
    const { error } = await supabase
      .from(config.table)
      .upsert(withoutPassword, { onConflict: idField });
    if (error) throw error;
  }
  if (withPassword.length) {
    const { error } = await supabase
      .from(config.table)
      .upsert(withPassword, { onConflict: idField });
    if (error) throw error;
  }

  // Delete rows that are no longer in the incoming collection.
  const currentIds = items
    .map((item) => castToDb(item[config.fields.find((f) => f[0] === idField)[0]], idType))
    .filter((v) => v !== null && v !== undefined);
  const { data: existing } = await supabase.from(config.table).select(idField);
  const existingIds = (existing || []).map((r) => r[idField]);
  const toDelete = existingIds.filter((id) => !currentIds.includes(id));
  if (toDelete.length) {
    await supabase.from(config.table).delete().in(idField, toDelete);
  }
};

const pushToSupabase = async (key, value) => {
  const config = COLLECTIONS[key];
  if (!config) return;
  if (config.isStringList) {
    await pushStringListToSupabase(config, value);
  } else {
    await pushCollectionToSupabase(config, value);
  }
};

// --------------------------------------------------------------------------
// Express backend implementation (used when Supabase is not configured)
// --------------------------------------------------------------------------
const hydrateFromExpress = async () => {
  try {
    const response = await fetch(`${appConfig.apiUrl}/store`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const data = await response.json();
    Object.keys(data || {}).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        localStorage.setItem(key, JSON.stringify(data[key]));
      }
    });
    backendAvailable = true;
  } catch (error) {
    backendAvailable = false;
  }
  return backendAvailable;
};

const pushToExpress = (key, value) => {
  if (!SYNC_KEYS.includes(key)) return;
  fetch(`${appConfig.apiUrl}/store/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: value }),
  }).catch(() => {
    /* ignore network/database errors; localStorage still holds the data */
  });
};

// --------------------------------------------------------------------------
// Public API
// --------------------------------------------------------------------------

// Pull every collection from the cloud database into localStorage so the
// existing (synchronous) screens read the persisted data. Best-effort: if the
// database is unreachable, the app keeps using whatever is in localStorage.
export const hydrateFromBackend = async () => {
  if (isSupabaseConfigured()) {
    try {
      return await hydrateFromSupabase();
    } catch (error) {
      backendAvailable = false;
      return false;
    }
  }
  return hydrateFromExpress();
};

// Write a single collection through to the cloud database. Best-effort and
// fire-and-forget so the UI never blocks or breaks when the database is down.
export const pushToBackend = (key, value) => {
  if (!SYNC_KEYS.includes(key)) return;
  if (isSupabaseConfigured()) {
    pushToSupabase(key, value).catch(() => {
      /* ignore; localStorage still holds the data */
    });
    return;
  }
  pushToExpress(key, value);
};
