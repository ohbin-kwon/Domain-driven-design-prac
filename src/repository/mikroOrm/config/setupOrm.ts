import { PostgreSqlDriver, SchemaGenerator } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import configOrm from './configOrm';

let orm: MikroORM<PostgreSqlDriver>;
let generator: SchemaGenerator;

export async function setUpMikroOrmSession(env: NODE_ENV) {
  orm = await MikroORM.init<PostgreSqlDriver>(configOrm);
  if(env === 'test'){
    generator = orm.getSchemaGenerator();
    await generator.createSchema();
  }
  const session = orm.em.fork({flushMode: 0});
  return session
}
// only for test
export async function tearDownMikroOrm(env: NODE_ENV) {
  if(env === 'test'){
    await generator.dropSchema();
  }
  orm.close();
}