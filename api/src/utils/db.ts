export interface PaginatedResult<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export class QueryBuilder<T = any> {
  private tableName: string = "";
  private fields: string[] = ["*"];
  private conditions: { col: string; op: string; val?: any }[] = [];
  private order: { col: string; dir: "ASC" | "DESC" }[] = [];

  constructor(private d1: D1Database) {}

  table(name: string): this {
    this.tableName = name;
    return this;
  }

  select(fields: string | string[]): this {
    if (Array.isArray(fields)) {
      this.fields = fields;
    } else {
      this.fields = [fields];
    }
    return this;
  }

  where(col: string, val: any): this;
  where(col: string, op: string, val: any): this;
  where(col: string, opOrVal: any, val?: any): this {
    let op = "=";
    let value = opOrVal;

    if (val !== undefined) {
      op = opOrVal;
      value = val;
    }

    this.conditions.push({ col, op, val: value });
    return this;
  }

  orderBy(col: string, dir: "asc" | "desc" = "asc"): this {
    this.order.push({ col, dir: dir.toUpperCase() as "ASC" | "DESC" });
    return this;
  }

  private buildWhereClause(): { sql: string; bindings: any[] } {
    if (this.conditions.length === 0) {
      return { sql: "", bindings: [] };
    }

    const clauses = this.conditions.map((c) => `${c.col} ${c.op} ?`);
    const bindings = this.conditions.map((c) => c.val);

    return {
      sql: `WHERE ${clauses.join(" AND ")}`,
      bindings,
    };
  }

  async get(): Promise<T[]> {
    const where = this.buildWhereClause();
    const orderBy =
      this.order.length > 0
        ? `ORDER BY ${this.order.map((o) => `${o.col} ${o.dir}`).join(", ")}`
        : "";

    const query = `SELECT ${this.fields.join(", ")} FROM ${this.tableName} ${where.sql} ${orderBy}`;

    const stmt = this.d1.prepare(query).bind(...where.bindings);
    const { results } = await stmt.all<T>();
    return results;
  }

  async paginate(page: number = 1, perPage: number = 15): Promise<PaginatedResult<T>> {
    const where = this.buildWhereClause();

    // 1. Count Total
    const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${where.sql}`;
    const countStmt = this.d1.prepare(countQuery).bind(...where.bindings);
    const countResult = await countStmt.first<{ total: number }>();
    const total = countResult?.total || 0;

    // 2. Fetch Data
    const offset = (page - 1) * perPage;
    const orderBy =
      this.order.length > 0
        ? `ORDER BY ${this.order.map((o) => `${o.col} ${o.dir}`).join(", ")}`
        : "";

    const dataQuery = `SELECT ${this.fields.join(", ")} FROM ${this.tableName} ${
      where.sql
    } ${orderBy} LIMIT ? OFFSET ?`;

    // Bindings for data query: where bindings + limit + offset
    const dataBindings = [...where.bindings, perPage, offset];

    const dataStmt = this.d1.prepare(dataQuery).bind(...dataBindings);
    const { results } = await dataStmt.all<T>();

    return {
      data: results,
      meta: {
        current_page: page,
        last_page: Math.ceil(total / perPage),
        per_page: perPage,
        total,
      },
    };
  }
}

export const db = (d1: D1Database) => new QueryBuilder(d1);
