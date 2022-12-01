import { Batch } from '../domain/batch';

export interface IRepository {
  get: <T extends BATCH_COLUMN>(filter: FILTER<T>) => Promise<Batch | null>;
  save: (batch: Batch) => Promise<void>;
  list: () => Promise<Batch[]>;
}
