import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  wrap,
} from '@mikro-orm/core';
import { Product } from '../../domain/product';
import { Exception } from '../../util/exception';
import { BatchEntity } from './BatchEntity';

@Entity()
export class ProductEntity {
  @PrimaryKey({ type: 'int', autoincrement: true })
  productId!: string;

  @Property({ type: 'text' })
  sku: string;

  @Property()
  versionNumber: number;

  @OneToMany('BatchEntity', 'product')
  batches = new Collection<BatchEntity>(this);

  constructor(sku: string, versionNumber: number) {
    this.sku = sku;
    this.versionNumber = versionNumber;
  }

  private static async _batchesFromDomain(
    product: Product,
    productEntity: ProductEntity,
  ) {
    const batchEntities = await Promise.all(
      [...product.batches].map((batch) =>
        BatchEntity.fromDomain(batch, productEntity),
      ),
    );
    return batchEntities;
  }

  private static async _generateNewProduct(product: Product) {
    const newProductEntity = new ProductEntity(
      product.sku,
      product.versionNumber,
    );
    const batchEntities = await this._batchesFromDomain(
      product,
      newProductEntity,
    );

    wrap(newProductEntity).assign(
      {
        batches: batchEntities,
      },
      { updateNestedEntities: true },
    );

    return newProductEntity;
  }

  private static async _updateProduct(
    product: Product,
    productEntity: ProductEntity,
  ) {
    const batchEntities = await this._batchesFromDomain(product, productEntity);

    wrap(productEntity).assign(
      {
        sku: product.sku,
        versionNumber: product.versionNumber,
        batches: batchEntities,
      },
      { updateNestedEntities: true },
    );

    return productEntity;
  }

  static async fromDomain(
    product: Product,
    productEntity: ProductEntity | null,
  ): Promise<ProductEntity> {
    if (productEntity === null) {
      return this._generateNewProduct(product);
    }

    return this._updateProduct(product, productEntity);
  }

  toDomain(): Product {
    if (this.batches.isInitialized() === false)
      throw new Exception(
        'this error cannot occur, product always have batches. if occur this error need to check product domain constructor, or convert fromDomain to entity model, or database error',
      );
    const batches = this.batches
      .getItems()
      .map((batchEntity) => batchEntity.toDomain());
    const product = new Product(this.sku, batches, this.versionNumber);

    return product;
  }
}
