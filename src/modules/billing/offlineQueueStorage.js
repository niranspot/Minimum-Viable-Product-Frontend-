import CryptoJS from "crypto-js";

// ─────────────────────────────────────────────────────────────────────────
// Offline billing queue storage — IndexedDB + AES-encrypted payloads.
//
// Every queue item is stored as one IndexedDB record:
//   { localId: <plain string, used as the keyPath>, cipher: <AES string> }
// The `localId` stays in the clear (it's an opaque local identifier, not
// sensitive), while everything else — the invoice data, status, retry
// count, etc. — is encrypted before it ever touches disk.
//
// NOTE on the encryption key: this is client-side AES, so it protects
// data at rest on the device (e.g. against casual inspection of the
// IndexedDB store or a stolen/shared machine) — it is NOT a substitute
// for server-side security, since any key shipped in a browser bundle is
// ultimately extractable by the user running that bundle. In production,
// inject this via a build-time env var rather than hardcoding it, and
// treat it as obfuscation-at-rest, not a real secret.
// ─────────────────────────────────────────────────────────────────────────

const DB_NAME = "BillingOfflineDB";
const DB_VERSION = 1;
const STORE_NAME = "offlineBillingQueue";

const ENCRYPTION_KEY =
  process.env.REACT_APP_QUEUE_ENC_KEY || "dev-only-fallback-key-change-me";

let dbPromise = null;

// ── Low-level DB open / transaction helpers ────────────────────────────

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Fires on first load, or whenever DB_VERSION is bumped — creates the
    // object store automatically if it doesn't already exist.
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "localId" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
    request.onblocked = () =>
      reject(new Error("IndexedDB upgrade blocked by another open tab."));
  });

  return dbPromise;
}

// Runs `executor` inside a transaction and resolves once the transaction
// completes (not just when the individual request succeeds) — this is
// the safest way to know a write has actually been committed.
function runTransaction(mode, executor) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        let request;

        try {
          request = executor(store);
        } catch (err) {
          reject(err);
          return;
        }

        tx.oncomplete = () => resolve(request ? request.result : undefined);
        tx.onerror = () => reject(tx.error || request?.error);
        tx.onabort = () => reject(tx.error || request?.error);
      }),
  );
}

// ── Encrypt / decrypt helpers ───────────────────────────────────────────

const encrypt = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();

const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
  const plainText = bytes.toString(CryptoJS.enc.Utf8);
  if (!plainText) {
    // Wrong key, corrupted ciphertext, etc. — decrypting to an empty
    // string is CryptoJS's way of signalling failure.
    throw new Error("Failed to decrypt queue record.");
  }
  return JSON.parse(plainText);
};

// ── Public API (same surface your saga already expects) ────────────────

/**
 * Add or overwrite a single queue item (put semantics — safe to call
 * again for the same localId, e.g. to update its status/retries).
 */
export async function addQueueItem(item) {
  try {
    const record = { localId: item.localId, cipher: encrypt(item) };
    await runTransaction("readwrite", (store) => store.put(record));
  } catch (error) {
    // A storage failure shouldn't take down the billing flow — the
    // in-memory Redux state remains the source of truth for the current
    // session; we just lose persistence until the next successful write.
    console.error("[offlineQueueStorage] addQueueItem failed:", error);
  }
}

/**
 * Remove a single queue item by its localId.
 */
export async function removeQueueItem(localId) {
  try {
    await runTransaction("readwrite", (store) => store.delete(localId));
    console.log("Deleted:", localId);
  } catch (error) {
    console.error("[offlineQueueStorage] removeQueueItem failed:", error);
  }
}

/**
 * Wipe the entire offline queue (e.g. on logout, or after a full
 * successful sync).
 */
export async function clearQueue() {
  try {
    await runTransaction("readwrite", (store) => store.clear());
  } catch (error) {
    console.error("[offlineQueueStorage] clearQueue failed:", error);
  }
}

/**
 * Load and decrypt every queue item, oldest first (so replay order on
 * reconnect matches the order invoices were created offline).
 */
export async function loadPersistedQueue() {
  try {
    const records = await runTransaction("readonly", (store) => store.getAll());
    if (!records || !records.length) return [];

    return records
      .map((record) => {
        try {
          return decrypt(record.cipher);
        } catch (err) {
          console.warn(
            `[offlineQueueStorage] Skipping corrupt record "${record.localId}":`,
            err,
          );
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.queuedAt - b.queuedAt);
  } catch (error) {
    console.error(
      "[offlineQueueStorage] loadPersistedQueue failed, starting empty:",
      error,
    );
    return [];
  }
}

/**
 * Full overwrite: clears the store and re-writes every item in `queue`.
 * Kept for API compatibility / bulk-replace use cases; the saga prefers
 * the more granular addQueueItem/removeQueueItem for per-item mutations
 * since they're cheaper than rewriting the whole store on every change.
 */
export async function persistQueue(queue) {
  try {
    await runTransaction("readwrite", (store) => {
      store.clear();
      queue.forEach((item) => {
        store.put({ localId: item.localId, cipher: encrypt(item) });
      });
    });
  } catch (error) {
    console.error("[offlineQueueStorage] persistQueue failed:", error);
  }
}

// ── Non-storage helpers (unchanged, still synchronous) ──────────────────

export const getInitialOnlineStatus = () =>
  typeof navigator !== "undefined" ? navigator.onLine : true;

export const genLocalId = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
