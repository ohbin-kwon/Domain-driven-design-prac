import { PostgreSqlDriver, SchemaGenerator } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import configOrm from './configOrm';

let ormConnection: Promise<MikroORM<PostgreSqlDriver>>;

export function connectMikroOrm() {
  ormConnection = MikroORM.init<PostgreSqlDriver>(configOrm);
  ormConnection
    .then(() => console.log('mikroOrm is connected'))
    .catch(() => console.log('mikroOrm connecting failed'));
}

export async function setUpMikroOrmSession() {
  const orm = await ormConnection;
  const session = orm.em.fork({ flushMode: 0 });
  return session;
}
