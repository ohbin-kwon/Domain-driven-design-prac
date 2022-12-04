import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Batch, Product } from '../../domain/product';
import { BatchEntity } from './BatchEntity';

@Entity()
export class ProductEntity {
  @PrimaryKey({ type: 'text' })
  sku: string;

  @Property({ type: 'int' })
  versionNumber: number;

  @OneToMany('BatchEntity', 'product')
  batches = new Collection<BatchEntity>(this);

  constructor(sku: string, versionNumber: number) {
    this.sku = sku;
    this.versionNumber = versionNumber;
  }

  static async fromDomain(product: Product) {
    const newProduct = new ProductEntity(product.sku, product.versionNumber);

    const batches = [...product.batches].map(
      (batch) =>
        new BatchEntity(
          batch.id,
          batch.sku,
          batch.quantity,
          newProduct,
          batch.eta,
        ),
    );

    for (const entity of batches) {
      newProduct.batches.add(entity);
    }
    return newProduct;
  }

  async toDomain(): Promise<Product> {
    const batches = this.batches
      .getItems()
      .map(
        (batch) => new Batch(batch.id, batch.sku, batch.quantity, batch.eta),
      );
    const record = new Product(this.sku, batches, this.versionNumber);

    return record;
  }
}
