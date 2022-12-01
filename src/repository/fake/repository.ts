import { Batch } from '../../domain/batch';
import { IRepository } from '../IRepository';

export function FakeRepository(init: Batch[]): IRepository {
  const repo = init;
  return {
    async list(): Promise<Batch[]> {
      return repo;
    },
    async get<T extends BATCH_COLUMN>(filter: FILTER<T>): Promise<Batch | null> {
      let targetColumn = Object.keys(filter)[0] as T;
      const targetBatch = repo.find(
        (batch) => batch[targetColumn] === filter[targetColumn],
      );
      if (targetBatch === undefined) return null;
      return targetBatch;
    },
    async save(batch: Batch) {
      repo.push(batch);
    },
  };
}
