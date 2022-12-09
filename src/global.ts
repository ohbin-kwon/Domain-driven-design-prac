import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
export {};

declare global {
  type NODE_ENV = 'test' | 'development' | 'production';
  type SESSION = SqlEntityManager<PostgreSqlDriver>;
  type GetKeysByValueType<Obj, Type> = {
    [Prop in keyof Obj]-?: Obj[Prop] extends Type ? Prop : never;
  }[keyof Obj];
  const enum AllocateResult {
    'SUCCESS' = 'allocation success',
    'OUT-OF-STOCK' = 'batch is out of stock',
    'DIFFERENT-SKU' = 'sku is different',
  }
}
