import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmRepository } from '../repository';
import config from './configOrm';

export async function configMikroOrm() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);

  const em = orm.em.fork();
  return MikroOrmRepository(em);
}
