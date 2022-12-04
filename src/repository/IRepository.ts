import { Product } from '../domain/product';

export type ProductSpecificProps = GetKeysByValueType<Product, string>;
export type Filter<T extends ProductSpecificProps> = { [key in T]: string };

export interface IRepository {
  get: <T extends ProductSpecificProps>(
    filter: Filter<T>,
  ) => Promise<Product | null>;
  save: (batch: Product) => Promise<void>;
  list: () => Promise<Product[]>;
}
