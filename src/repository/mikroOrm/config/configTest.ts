import { PostgreSqlDriver, SchemaGenerator } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmRepository } from '../repository';
import config from './configOrm';

let orm: MikroORM<PostgreSqlDriver>;
let generator: SchemaGenerator;

export async function setupMikroOrmRepo() {
  orm = await MikroORM.init<PostgreSqlDriver>(config);

  generator = orm.getSchemaGenerator();
  await generator.createSchema();

  const em = orm.em.fork();
  return MikroOrmRepository(em);
}

export async function tearDownMikroOrm() {
  await generator.dropSchema();
  orm.close();
}