import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Product } from '../../domain/product';
import { ProductSpecificProps, Filter, IRepository } from '../IRepository';
import { ProductEntity } from './ProductEntity';

export function MikroOrmRepository(
  em: MikroORM<PostgreSqlDriver>['em'],
): IRepository {
  const productRepo = em.getRepository(ProductEntity);
  return {
    async get<T extends ProductSpecificProps>(filter: Filter<T>) {
      const productEntity = await productRepo.findOne(filter, {
        populate: true,
      });
      const product = productEntity?.toDomain();
      return product ?? null;
    },
    async save(product: Product) {
      const loaded = await productRepo.findOne(
        { sku: product.sku },
        { populate: true },
      );
      const productEntity = await ProductEntity.fromDomain(product, loaded); // insert into batch, orderLine insertInto
      productRepo.persist(productEntity);
    },
    async list() {
      const productEntityList = await productRepo.findAll({ populate: true });
      return Promise.all(
        productEntityList.map((productEntity) => productEntity.toDomain()),
      );
    },
  };
}
