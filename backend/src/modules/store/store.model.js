const db = require("../../database");
const COLLECTIONS = require("./collections.config");
const { hashPassword } = require("../../utils/password");

const coerceRead = (value, type) => {
  if (value === null || value === undefined) return value;
  if (type === "int" || type === "numeric") return Number(value);
  return value; // text and json (pg returns parsed json) pass through
};

const coerceWrite = (value, type) => {
  if (value === undefined) value = null;
  if (type === "json") return value === null ? null : JSON.stringify(value);
  return value;
};

// Read one collection into an array of JS objects (passwords are never returned).
const readCollection = async (key) => {
  const config = COLLECTIONS[key];
  if (!config) return [];

  if (config.isStringList) {
    const result = await db.query(`SELECT ${config.column} AS name FROM ${config.table}`);
    return result.rows.map((row) => row.name);
  }

  const selectCols = config.fields
    .map(([, col]) => `${col}`)
    .join(", ");
  const result = await db.query(`SELECT ${selectCols} FROM ${config.table}`);
  return result.rows.map((row) => {
    const obj = {};
    config.fields.forEach(([js, col, type]) => {
      obj[js] = coerceRead(row[col], type);
    });
    return obj;
  });
};

exports.readAll = async () => {
  const out = {};
  for (const key of Object.keys(COLLECTIONS)) {
    out[key] = await readCollection(key);
  }
  return out;
};

exports.readOne = async (key) => readCollection(key);

// Replace a whole collection so the table matches the provided array. Account
// passwords are hashed with bcrypt; when a record omits a password the existing
// hash is preserved.
exports.replaceCollection = async (key, items) => {
  const config = COLLECTIONS[key];
  if (!config) {
    const error = new Error(`Unknown collection: ${key}`);
    error.status = 400;
    throw error;
  }
  const rows = Array.isArray(items) ? items : [];
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    if (config.isStringList) {
      await client.query(`DELETE FROM ${config.table}`);
      for (const name of rows) {
        if (name === null || name === undefined || name === "") continue;
        await client.query(
          `INSERT INTO ${config.table} (${config.column}) VALUES ($1)
           ON CONFLICT (${config.column}) DO NOTHING`,
          [name],
        );
      }
      await client.query("COMMIT");
      return rows;
    }

    const idCol = config.fields.find(([js]) => js === config.idField)[1];
    const keptIds = [];

    for (const record of rows) {
      const cols = [];
      const placeholders = [];
      const values = [];
      let i = 1;

      config.fields.forEach(([js, col, type]) => {
        cols.push(col);
        placeholders.push(`$${i}`);
        values.push(coerceWrite(record[js], type));
        i += 1;
      });

      // Optional password column (hash when provided, otherwise skip so the
      // existing hash is kept on update).
      let hashedCol = null;
      if (config.password) {
        const plain = record[config.password.js];
        if (plain) {
          hashedCol = config.password.col;
          cols.push(hashedCol);
          placeholders.push(`$${i}`);
          values.push(await hashPassword(String(plain)));
          i += 1;
        }
      }

      const updates = cols
        .filter((col) => col !== idCol)
        .map((col) => `${col} = EXCLUDED.${col}`)
        .join(", ");

      const sql =
        `INSERT INTO ${config.table} (${cols.join(", ")}) VALUES (${placeholders.join(", ")})` +
        ` ON CONFLICT (${idCol}) DO UPDATE SET ${updates || `${idCol} = EXCLUDED.${idCol}`}`;

      await client.query(sql, values);
      keptIds.push(record[config.idField]);
    }

    // Remove rows that are no longer present in the incoming array.
    if (keptIds.length === 0) {
      await client.query(`DELETE FROM ${config.table}`);
    } else {
      const ph = keptIds.map((_, idx) => `$${idx + 1}`).join(", ");
      await client.query(
        `DELETE FROM ${config.table} WHERE ${idCol} NOT IN (${ph})`,
        keptIds,
      );
    }

    await client.query("COMMIT");
    return readCollection(key);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
