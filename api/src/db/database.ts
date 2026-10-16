import { Pool } from "pg";

import type { PoolConfig } from "pg";

const pgConfig: PoolConfig = {
    host: process.env.PGHOST,
    port: 5433,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
};

export const myPool = new Pool(pgConfig);
