// Valid SQL identifier pattern: starts with letter or underscore, followed by alphanumeric/underscore
const VALID_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// Allowed SQL operators
const ALLOWED_OPERATORS = new Set([
  "=",
  "!=",
  "<>",
  "<",
  ">",
  "<=",
  ">=",
  "LIKE",
  "NOT LIKE",
  "IN",
  "NOT IN",
  "IS",
  "IS NOT",
]);

function validateIdentifier(name: string): string {
  if (!VALID_IDENTIFIER.test(name)) {
    throw new Error(`Invalid SQL identifier: ${name}`);
  }
  return name;
}

function validateOperator(op: string): string {
  const normalized = op.toUpperCase().trim();
  if (!ALLOWED_OPERATORS.has(normalized)) {
    throw new Error(`Invalid SQL operator: ${op}`);
  }
  return normalized;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface WhereCondition {
  col: string;
  op: string;
  val: unknown;
}

interface OrderClause {
  col: string;
  dir: "ASC" | "DESC";
}

const DEFAULT_LIMIT = 1000;

export class QueryBuilder<T = unknown> {
  private tableName = "";
  private fields: string[] = ["*"];
  private conditions: WhereCondition[] = [];
  private order: OrderClause[] = [];
  private limitValue: number | null = null;

  constructor(private d1: D1Database) {}

  table(name: string): this {
    this.tableName = validateIdentifier(name);
    return this;
  }

  select(fields: string | string[]): this {
    const fieldList = Array.isArray(fields) ? fields : [fields];
    this.fields = fieldList.map((f) => {
      // Allow "*" as a special case
      if (f === "*") return f;
      return validateIdentifier(f);
    });
    return this;
  }

  where(col: string, val: unknown): this;
  where(col: string, op: string, val: unknown): this;
  where(col: string, opOrVal: unknown, val?: unknown): this {
    const validCol = validateIdentifier(col);
    let op = "=";
    let value = opOrVal;

    if (val !== undefined) {
      op = validateOperator(opOrVal as string);
      value = val;
    }

    this.conditions.push({ col: validCol, op, val: value });
    return this;
  }

  orderBy(col: string, dir: "asc" | "desc" = "asc"): this {
    const validCol = validateIdentifier(col);
    // Runtime validation to ensure only ASC/DESC even if called with unexpected values
    const validDir = dir.toLowerCase() === "desc" ? "DESC" : "ASC";
    this.order.push({ col: validCol, dir: validDir });
    return this;
  }

  limit(count: number): this {
    // Clamp limit to safe bounds
    this.limitValue = Math.max(1, Math.min(count, DEFAULT_LIMIT));
    return this;
  }

  private validateTableSet(): void {
    if (!this.tableName) {
      throw new Error("Table name not set. Call .table() first.");
    }
  }

  private buildWhereClause(): { sql: string; bindings: unknown[] } {
    if (this.conditions.length === 0) {
      return { sql: "", bindings: [] };
    }

    const clauses: string[] = [];
    const bindings: unknown[] = [];

    for (const c of this.conditions) {
      if ((c.op === "IN" || c.op === "NOT IN") && Array.isArray(c.val)) {
        if (c.val.length === 0) {
          // Empty array: always false condition
          clauses.push("1 = 0");
        } else {
          const placeholders = c.val.map(() => "?").join(", ");
          clauses.push(`${c.col} ${c.op} (${placeholders})`);
          bindings.push(...c.val);
        }
      } else {
        clauses.push(`${c.col} ${c.op} ?`);
        bindings.push(c.val);
      }
    }

    return {
      sql: `WHERE ${clauses.join(" AND ")}`,
      bindings,
    };
  }

  private buildOrderByClause(): string {
    if (this.order.length === 0) {
      return "";
    }
    return `ORDER BY ${this.order.map((o) => `${o.col} ${o.dir}`).join(", ")}`;
  }

  async get(): Promise<T[]> {
    this.validateTableSet();
    const where = this.buildWhereClause();
    const orderBy = this.buildOrderByClause();

    // Enforce a default limit to prevent unbounded scans
    const effectiveLimit = this.limitValue ?? DEFAULT_LIMIT;

    const query = `SELECT ${this.fields.join(", ")} FROM ${this.tableName} ${where.sql} ${orderBy} LIMIT ?`;
    const bindings = [...where.bindings, effectiveLimit];

    const stmt = this.d1.prepare(query).bind(...bindings);
    const { results } = await stmt.all<T>();
    return results;
  }

  async paginate(page = 1, perPage = 15): Promise<PaginatedResult<T>> {
    this.validateTableSet();
    const where = this.buildWhereClause();

    // 1. Count Total
    const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${where.sql}`;
    const countStmt = this.d1.prepare(countQuery).bind(...where.bindings);
    const countResult = await countStmt.first<{ total: number }>();
    const total = countResult?.total ?? 0;

    // 2. Fetch Data with ordering
    const offset = (page - 1) * perPage;

    // Default to ROWID ordering if no explicit order specified (ensures consistent pagination)
    const orderBy = this.order.length > 0 ? this.buildOrderByClause() : "ORDER BY rowid";

    const dataQuery = `SELECT ${this.fields.join(", ")} FROM ${this.tableName} ${where.sql} ${orderBy} LIMIT ? OFFSET ?`;
    const dataBindings = [...where.bindings, perPage, offset];

    const dataStmt = this.d1.prepare(dataQuery).bind(...dataBindings);
    const { results } = await dataStmt.all<T>();

    return {
      data: results,
      meta: {
        current_page: page,
        last_page: Math.ceil(total / perPage) || 1,
        per_page: perPage,
        total,
      },
    };
  }
}

export const db = (d1: D1Database) => new QueryBuilder(d1);
