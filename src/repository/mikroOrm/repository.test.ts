import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver, SchemaGenerator } from '@mikro-orm/postgresql';
import { createRepoTest } from '../createRepoTest';
import { MikroOrmRepository } from './repository';
import dotenv from 'dotenv'
import { ENV_PATH } from '../../../const';
import { OrderLineEntity } from './OrderLineEntity';
import { BatchEntity } from './BatchEntity';
import path from 'path'
dotenv.config({
  path: path.join(__dirname, ENV_PATH),
});

let orm: MikroORM<PostgreSqlDriver>;
let generator: SchemaGenerator;

createRepoTest(
  'MikroOrmTest',
  async () => {
    orm = await MikroORM.init<PostgreSqlDriver>({
      entities: [BatchEntity, OrderLineEntity],
      dbName: process.env.POSTGRES_DB_NAME,
      type: 'postgresql',
      user: process.env.POSTGRES_USER_NAME,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
    });

    generator = orm.getSchemaGenerator();
    await generator.createSchema();

    const em = orm.em.fork();
    return MikroOrmRepository(em);
  },
  async () => {
    await generator.dropSchema();
    orm.close();
  },
);
