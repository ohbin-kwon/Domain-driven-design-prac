import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";
import { Batch } from "./domain/batch";

export {};

declare global {
    type NODE_ENV = 'test' | 'development' | 'production';
    type SESSION = SqlEntityManager<PostgreSqlDriver> | Batch[]
}