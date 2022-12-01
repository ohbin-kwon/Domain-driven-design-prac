import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';

export {};

declare global {
  type NODE_ENV = 'test' | 'development' | 'production';
  type SESSION = SqlEntityManager<PostgreSqlDriver>;
}
