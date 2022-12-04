import { Product } from '../../domain/product';
import { ProductSpecificProps, Filter, IRepository } from '../IRepository';

export function FakeRepository(init: Product[]): IRepository {
  const repo = init;
  return {
    async list(): Promise<Product[]> {
      return repo;
    },
    async get<T extends ProductSpecificProps>(
      filter: Filter<T>,
    ): Promise<Product | null> {
      let targetColumn = Object.keys(filter)[0] as T;
      const targetBatch = repo.find(
        (product) => product[targetColumn] === filter[targetColumn],
      );
      if (targetBatch === undefined) return null;
      return targetBatch;
    },
    async save(product: Product) {
      repo.push(product);
    },
  };
}
