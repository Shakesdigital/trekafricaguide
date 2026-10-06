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
      _orders: [], // Stack of order clauses (first = primary, like Supabase)
      _limitVal: null,
      _single: false,
      _maybeSingle: false,
      _postOp: false,
      _insertData: null,
      _updateData: null,
    };

    const chain = {
      select(cols = '*', opts = {}) {
        ctx._selectCols = cols;
        ctx._selectOpts = opts;
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
      is(column, value) {
        // Supabase .is() — checks for NULL (value === null) or boolean
        ctx._filters.push({ type: 'is', column, value });
        return chain;
      },
      not(column, op, value) {
        // Supabase .not() — negates a filter
        if (op === 'is' && value === null) {
          ctx._filters.push({ type: 'not-is', column, value });
        } else if (op === 'eq') {
          ctx._filters.push({ type: 'neq', column, value });
        } else {
          // Fallback: treat as not-equal
          ctx._filters.push({ type: 'neq', column, value });
        }
        return chain;
      },
      gte(column, value) {
        ctx._filters.push({ type: 'gte', column, value });
        return chain;
      },
      in(column, values) {
        // Supabase .in() — checks if column value is in the array
        ctx._filters.push({ type: 'in', column, values });
        return chain;
      },
      lte(column, value) {
        ctx._filters.push({ type: 'lte', column, value });
        return chain;
      },
      lt(column, value) {
        ctx._filters.push({ type: 'lt', column, value });
        return chain;
      },
      gt(column, value) {
        ctx._filters.push({ type: 'gt', column, value });
        return chain;
      },
      or(conditions) {
        // Parse comma-separated OR conditions
        // Supports: col.ilike.*pattern* and col.is.null
        const parsed = conditions.split(',').map((s) => {
          const trimmed = s.trim();
          // Match "col.is.null" pattern
          const isNullMatch = trimmed.match(/^(\w+)\.is\.null$/);
          if (isNullMatch) {
            return { column: isNullMatch[1], type: 'is-null' };
          }
          // Match "col.ilike.*pattern*"
          const ilikeMatch = trimmed.match(/^(\w+)\.ilike\.\*(.+?)\*$/);
          if (ilikeMatch) {
            return { column: ilikeMatch[1], pattern: ilikeMatch[2].toLowerCase(), type: 'ilike' };
          }
          // Match "col.eq.value" pattern
          const eqMatch = trimmed.match(/^(\w+)\.eq\.(.+)$/);
          if (eqMatch) {
            return { column: eqMatch[1], value: eqMatch[2], type: 'eq' };
          }
          return null;
        }).filter(Boolean);
        ctx._filters.push({ type: 'or', conditions: parsed });
        return chain;
      },
      order(column, opts = {}) {
        ctx._orders.push({ column, ascending: opts.ascending ?? false });
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
            // null eq matches both null and undefined
            if (f.value === null) return row[f.column] == null;
            return row[f.column] == f.value;
          });
        } else if (f.type === 'neq') {
          if (f.value === null) {
            result = result.filter((row) => row[f.column] != null);
          } else {
            result = result.filter((row) => row[f.column] !== f.value);
          }
        } else if (f.type === 'is') {
          if (f.value === null) {
            result = result.filter((row) => row[f.column] == null);
          } else {
            result = result.filter((row) => row[f.column] == f.value);
          }
        } else if (f.type === 'not-is') {
          result = result.filter((row) => row[f.column] != null);
        } else if (f.type === 'ilike') {
          result = result.filter((row) => String(row[f.column] || '').toLowerCase().includes(f.pattern));
        } else if (f.type === 'or') {
          result = result.filter((row) => f.conditions.some((c) => {
            if (c.type === 'is-null') return row[c.column] == null;
            if (c.type === 'ilike') return String(row[c.column] || '').toLowerCase().includes(c.pattern);
            if (c.type === 'eq') return row[c.column] == c.value;
            return false;
          }));
        } else if (f.type === 'gte') {
          result = result.filter((row) => row[f.column] >= f.value);
        } else if (f.type === 'lte') {
          result = result.filter((row) => row[f.column] <= f.value);
        } else if (f.type === 'lt') {
          result = result.filter((row) => row[f.column] < f.value);
        } else if (f.type === 'gt') {
          result = result.filter((row) => row[f.column] > f.value);
        } else if (f.type === 'in') {
          result = result.filter((row) => f.values.includes(row[f.column]));
        }
      }

      // Apply multi-column ordering (Supabase-style: first .order() is primary)
      if (ctx._orders.length > 0) {
        result.sort((a, b) => {
          for (const ord of ctx._orders) {
            const av = a[ord.column];
            const bv = b[ord.column];
            if (av === bv) continue;
            const cmp = av < bv ? -1 : 1;
            return ord.ascending ? cmp : -cmp;
          }
          return 0;
        });
      } else {
        // Default: created_at descending
        result.sort((a, b) => {
          const av = a.created_at;
          const bv = b.created_at;
          if (av === bv) return 0;
          return av < bv ? 1 : -1;
        });
      }

      if (ctx._limitVal) result = result.slice(0, ctx._limitVal);

      // Handle count + head options (Supabase-style)
      if (ctx._selectOpts?.count) {
        const countResult = result.length;
        if (ctx._selectOpts.head) {
          return { data: null, error: null, count: countResult };
        }
        return { data: result.map((r) => ({ ...r })), error: null, count: countResult };
      }
      if (ctx._selectOpts?.head) {
        return { data: null, error: null };
      }

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
          matched = matched.filter((row) => f.value === null ? row[f.column] == null : row[f.column] == f.value);
        } else if (f.type === 'is') {
          if (f.value === null) {
            matched = matched.filter((row) => row[f.column] == null);
          } else {
            matched = matched.filter((row) => row[f.column] == f.value);
          }
        } else if (f.type === 'not-is') {
          matched = matched.filter((row) => row[f.column] != null);
        } else if (f.type === 'neq') {
          if (f.value === null) {
            matched = matched.filter((row) => row[f.column] != null);
          } else {
            matched = matched.filter((row) => row[f.column] !== f.value);
          }
        } else if (f.type === 'gte') {
          matched = matched.filter((row) => row[f.column] >= f.value);
        } else if (f.type === 'lte') {
          matched = matched.filter((row) => row[f.column] <= f.value);
        } else if (f.type === 'lt') {
          matched = matched.filter((row) => row[f.column] < f.value);
        } else if (f.type === 'gt') {
          matched = matched.filter((row) => row[f.column] > f.value);
        } else if (f.type === 'in') {
          matched = matched.filter((row) => f.values.includes(row[f.column]));
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
    rpc(fnName, params) {
      if (fnName === 'log_cm_activity') {
        return {
          data: randomUUID(),
          error: null,
          then: (resolve) => resolve({ data: randomUUID(), error: null }),
        };
      }
      if (fnName === 'log_knowledge_activity') {
        return {
          data: randomUUID(),
          error: null,
          then: (resolve) => resolve({ data: randomUUID(), error: null }),
        };
      }
      if (fnName === 'set_updated_at') {
        return {
          data: null,
          error: null,
          then: (resolve) => resolve({ data: null, error: null }),
        };
      }
      return {
        data: [],
        error: null,
        then: (resolve) => resolve({ data: [], error: null }),
      };
    },
  };
}

export { createMockClient };
