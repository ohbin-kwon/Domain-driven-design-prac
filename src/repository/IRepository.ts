import { Batch } from '../domain/batch';

export type BatchSpecificProps = GetKeysByValueType<Batch, string>;
export type Filter<T extends BatchSpecificProps> = { [key in T]: string };

export interface IRepository {
  get: <T extends BatchSpecificProps>(filter: Filter<T>) => Promise<Batch | null>;
  save: (batch: Batch) => Promise<void>;
  list: () => Promise<Batch[]>;
}
