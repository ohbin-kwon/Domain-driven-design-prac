import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';

export {};

declare global {
  type NODE_ENV = 'test' | 'development' | 'production';
  type SESSION = SqlEntityManager<PostgreSqlDriver>;
  type BATCH_COLUMN = 'id' | 'sku';
  type FILTER<T extends BATCH_COLUMN> = { [key in T]: string };
}
