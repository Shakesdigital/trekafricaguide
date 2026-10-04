// Shared mock Supabase client for Content Manager tests.
// Provides a simple in-memory table store with the query methods used
// by server modules. Call client._seed(table, rows) to pre-seed data.

import { randomUUID } from 'node:crypto';

function createMockClient(tables = {}) {
  const store = {};
  for (const [table, rows] of Object.entries(tables)) {
    store[table] = [...rows];
  }

  function makeChain(tableName) {
    if (!store[tableName]) store[tableName] = [];

    const ctx = {
      _tableName: tableName,
      _data: store[tableName],
      _filters: [],
      _order: { column: 'created_at', ascending: false },
      _limitVal: null,
      _single: false,
      _maybeSingle: false,
      _postOp: false,
      _insertData: null,
      _updateData: null,
    };

    const chain = {
      select(cols = '*') {
        ctx._selectCols = cols;
        return chain;
      },
      eq(column, value) {
        ctx._filters.push({ type: 'eq', column, value });
        return chain;
      },
      neq(column, value) {
        ctx._filters.push({ type: 'neq', column, value });
        return chain;
      },
      ilike(column, pattern) {
        // Convert SQL LIKE with * wildcards to substring match
        const p = pattern.replace(/\*/g, '').replace(/%/g, '').toLowerCase();
        ctx._filters.push({ type: 'ilike', column, pattern: p });
        return chain;
      },
      or(conditions) {
        // Parse simple "col.ilike.*pattern*" comma-separated OR
        const parsed = conditions.split(',').map((s) => {
          const m = s.trim().match(/^(\w+)\.ilike\.\*(.+?)\*$/);
          return m ? { column: m[1], pattern: m[2].toLowerCase() } : null;
        }).filter(Boolean);
        ctx._filters.push({ type: 'or', conditions: parsed });
        return chain;
      },
      order(column, opts = {}) {
        ctx._order = { column, ascending: opts.ascending ?? false };
        return chain;
      },
      limit(n) {
        ctx._limitVal = n;
        return chain;
      },
      single() {
        ctx._single = true;
        return chain;
      },
      maybeSingle() {
        ctx._maybeSingle = true;
        return chain;
      },
      insert(rowOrRows) {
        const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
        const inserted = rows.map((row) => {
          const fullRow = { ...row };
          if (!fullRow.id) fullRow.id = randomUUID();
          if (!fullRow.created_at) fullRow.created_at = new Date().toISOString();
          if (!fullRow.updated_at) fullRow.updated_at = fullRow.created_at;
          if (fullRow.version === undefined) fullRow.version = 1;
          store[tableName].push(fullRow);
          return fullRow;
        });
        ctx._insertData = inserted.length === 1 ? inserted[0] : inserted;
        ctx._postOp = true;
        return chain;
      },
      update(updates) {
        ctx._updateData = updates;
        ctx._postOp = true;
        return chain;
      },
      // Terminal: resolve as a Promise
      then(resolve, reject) {
        if (ctx._postOp) {
          resolve(chain._executePostOp());
        } else {
          resolve(chain._executeQuery());
        }
        return chain;
      },
      catch(handle) { return chain; },
      // For .rpc() chains
      rpc(fnName, params) {
        if (fnName === 'log_cm_activity') {
          return {
            data: randomUUID(),
            error: null,
            then: (resolve) => resolve({ data: randomUUID(), error: null }),
          };
        }
        return {
          data: [],
          error: null,
          then: (resolve) => resolve({ data: [], error: null }),
        };
      },
    };

    // Attach internal methods
    chain._executeQuery = () => {
      let result = [...ctx._data];

      for (const f of ctx._filters) {
        if (f.type === 'eq') {
          result = result.filter((row) => {
            // == handles BigInt vs Number coercion (42n == 42 → true)
            return row[f.column] == f.value;
          });
        } else if (f.type === 'neq') {
          result = result.filter((row) => row[f.column] !== f.value);
        } else if (f.type === 'ilike') {
          result = result.filter((row) => String(row[f.column] || '').toLowerCase().includes(f.pattern));
        } else if (f.type === 'or') {
          result = result.filter((row) => f.conditions.some((c) =>
            String(row[c.column] || '').toLowerCase().includes(c.pattern)
          ));
        }
      }

      result.sort((a, b) => {
        const av = a[ctx._order.column];
        const bv = b[ctx._order.column];
        if (av === bv) return 0;
        const cmp = av < bv ? -1 : 1;
        return ctx._order.ascending ? cmp : -cmp;
      });

      if (ctx._limitVal) result = result.slice(0, ctx._limitVal);

      // Return shallow copies to prevent aliasing between callers
      if (ctx._single) return { data: result[0] ? { ...result[0] } : null, error: null };
      if (ctx._maybeSingle) return { data: result[0] ? { ...result[0] } : null, error: null };
      return { data: result.map((r) => ({ ...r })), error: null };
    };

    chain._executePostOp = () => {
      if (ctx._insertData) {
        return { data: { ...ctx._insertData }, error: null };
      }

      // Update operation
      let matched = [...ctx._data];
      for (const f of ctx._filters) {
        if (f.type === 'eq') {
          matched = matched.filter((row) => row[f.column] == f.value);
        }
      }

      if (ctx._updateData) {
        const upd = { ...ctx._updateData };
        if (!upd.updated_at) upd.updated_at = new Date().toISOString();
        for (const row of matched) {
          Object.assign(row, upd);
        }
      }

      // Return shallow copies to prevent aliasing between callers
      if (ctx._single) return { data: matched[0] ? { ...matched[0] } : null, error: null };
      if (ctx._maybeSingle) return { data: matched.length > 0 ? { ...matched[0] } : null, error: null };
      return { data: matched.map((r) => ({ ...r })), error: null };
    };

    return chain;
  }

  return {
    _store: store,
    _seed(table, rows) {
      store[table] = [...rows];
    },
    _get(table) {
      return store[table] || [];
    },
    from(table) {
      return makeChain(table);
    },
    auth: {
      async getUser(token) {
        if (token === 'valid-admin-token') {
          return { data: { user: { id: 'admin-user-id', email: 'admin@test.com', is_anonymous: false } }, error: null };
        }
        if (token === 'valid-editor-token') {
          return { data: { user: { id: 'editor-user-id', email: 'editor@test.com', is_anonymous: false } }, error: null };
        }
        if (token === 'viewer-token') {
          return { data: { user: { id: 'viewer-user-id', email: 'viewer@test.com', is_anonymous: false } }, error: null };
        }
        if (token === 'invalid-token') {
          return { data: { user: null }, error: new Error('Invalid token') };
        }
        if (token === 'anon-token') {
          return { data: { user: { id: 'anon-user-id', email: 'anon@test.com', is_anonymous: true } }, error: null };
        }
        // Default: check against seeded users
        const user = store._users?.find((u) => u.token === token);
        if (user) {
          return { data: { user: { id: user.id, email: user.email, is_anonymous: false } }, error: null };
        }
        return { data: { user: null }, error: new Error('Invalid token') };
      },
    },
    rpc(fnName) {
      if (fnName === 'log_cm_activity') {
        return {
          then: (resolve) => resolve({ data: randomUUID(), error: null }),
        };
      }
      return {
        then: (resolve) => resolve({ data: [], error: null }),
      };
    },
  };
}

export { createMockClient };
