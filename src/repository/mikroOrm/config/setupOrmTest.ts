import { PostgreSqlDriver, SchemaGenerator } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import configOrm from './configOrm';

let orm: MikroORM<PostgreSqlDriver>;
let generator: SchemaGenerator;

export async function connectMikroOrm() {
  orm = await MikroORM.init<PostgreSqlDriver>(configOrm);
  generator = orm.getSchemaGenerator();
  await generator.createSchema();
}

export async function setUpMikroOrmSession() {
  const session = orm.em.fork({ flushMode: 0 });
  return session;
}

export async function tearDownMikroOrm() {
  await generator.dropSchema();
  await orm.close();
}
