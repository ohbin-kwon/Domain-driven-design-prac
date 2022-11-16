import { Batch } from '../domain/batch';

export interface IRepository {
  get: (id: string) => Promise<Batch | null>;
  save: (batch: Batch) => Promise<void>;
  list: () => Promise<Batch[]>;
}