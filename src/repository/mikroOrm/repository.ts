import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Batch, Product } from '../../domain/product';
import { ProductSpecificProps, Filter, IRepository } from '../IRepository';
import { BatchEntity } from './BatchEntity';
import { ProductEntity } from './ProductEntity';

export function MikroOrmRepository(
  em: MikroORM<PostgreSqlDriver>['em'],
): IRepository {
  const productRepo = em.getRepository(ProductEntity);
  return {
    async get<T extends ProductSpecificProps>(filter: Filter<T>) {
      const productEntity = await productRepo.findOne(filter);
      const product = await productEntity?.toDomain();
      return product ?? null;
    },
    async save(product: Product) {
      const productEntity = await ProductEntity.fromDomain(product); // insert into batch, orderLine insertInto
      productRepo.persist(productEntity);
    },
    async list() {
      const productEntityList = await productRepo.findAll();
      return Promise.all(
        productEntityList.map((productEntity) => productEntity.toDomain()),
      );
    },
  };
}
