import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Batch } from '../../domain/batch';
import { BatchSpecificProps, Filter, IRepository } from '../IRepository';
import { BatchEntity } from './BatchEntity';

export function MikroOrmRepository(
  em: MikroORM<PostgreSqlDriver>['em'],
): IRepository {
  const batchRepo = em.getRepository(BatchEntity);
  return {
    async list(): Promise<Batch[]> {
      const batchEntityList = await batchRepo.findAll();
      return Promise.all(
        batchEntityList.map((batchEntity) => batchEntity.toDomain()),
      );
    },
    async get<T extends BatchSpecificProps>(filter: Filter<T>): Promise<Batch | null> {
      const batchEntity = await batchRepo.findOne(filter);
      const batch = await batchEntity?.toDomain();
      return batch ?? null;
    },
    async save(batch: Batch) {
      const batchEntity = await BatchEntity.fromDomain(batch); // insert into batch, orderLine insertInto
      batchRepo.persist(batchEntity);
    },
  };
}
