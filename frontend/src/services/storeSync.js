import appConfig from "../config/appConfig";

// Keys that mirror the localStorage collections used across the app. These are
// the same keys defined in localStore.js.
export const SYNC_KEYS = [
  "psis_teacher_accounts",
  "psis_schedule_data",
  "psis_student_accounts",
  "psis_staff_accounts",
  "psis_classes",
  "psis_attendance_records",
  "psis_academic_records",
];

let backendAvailable = false;

export const isBackendAvailable = () => backendAvailable;

// Pull every collection from the backend database into localStorage so the
// existing (synchronous) screens read the persisted data. Best-effort: if the
// backend/database is unreachable, the app keeps using whatever is already in
// localStorage.
export const hydrateFromBackend = async () => {
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

// Write a single collection through to the backend database. Best-effort and
// fire-and-forget so the UI never blocks or breaks when the database is down.
export const pushToBackend = (key, value) => {
  if (!SYNC_KEYS.includes(key)) return;
  fetch(`${appConfig.apiUrl}/store/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: value }),
  }).catch(() => {
    /* ignore network/database errors; localStorage still holds the data */
  });
};
