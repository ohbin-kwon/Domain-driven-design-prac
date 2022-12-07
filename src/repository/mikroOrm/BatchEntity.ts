import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  ManyToOne,
  wrap,
} from '@mikro-orm/core';
import { Batch } from '../../domain/product';
import { OrderLineEntity } from './OrderLineEntity';
import { ProductEntity } from './ProductEntity';

@Entity()
export class BatchEntity {
  @PrimaryKey({ type: 'text' })
  batchId!: string;

  @Property({ type: 'text' })
  sku: string;

  @Property({ type: 'int' })
  quantity: number;

  @OneToMany('OrderLineEntity', 'batch')
  allocations = new Collection<OrderLineEntity>(this);

  @ManyToOne('ProductEntity')
  product!: ProductEntity;

  @Property({ type: 'date', nullable: true })
  eta?: Date;

  constructor(
    batchId: string,
    sku: string,
    quantity: number,
    product: ProductEntity,
    eta?: Date,
  ) {
    this.batchId = batchId;
    this.sku = sku;
    this.quantity = quantity;
    this.product = product;
    this.eta = eta;
  }

  static async _getBatchById(
    batchId: string,
    productEntity: ProductEntity,
  ): Promise<BatchEntity | undefined> {
    // MicroOrm collection do not have get Method. it only have matching method
    // batchId is the identifier, so records length always 0 or 1
    const batchEntity = (
      await productEntity.batches.matching({
        where: { batchId },
      })
    )[0];
    return batchEntity;
  }
  // orderLine is always made as new orderLine
  // because orderLine is value object
  private static async _ordersFromDomain(
    batch: Batch,
    batchEntity: BatchEntity,
  ) {
    const orderEntities = await Promise.all(
      [...batch._allocation].map((line) =>
        OrderLineEntity.fromDomain(line, batchEntity),
      ),
    );

    return orderEntities;
  }

  private static async _generateNewBatch(
    batch: Batch,
    productEntity: ProductEntity,
  ) {
    const newBatchEntity = new BatchEntity(
      batch.batchId,
      batch.sku,
      batch.quantity,
      productEntity,
      batch.eta,
    );

    const orderEntities = await this._ordersFromDomain(batch, newBatchEntity);

    wrap(newBatchEntity).assign({
      allocations: orderEntities,
    });

    return newBatchEntity;
  }

  private static async _updateBatch(
    batch: Batch,
    batchEntity: BatchEntity,
    productEntity: ProductEntity,
  ) {
    const orderEntities = await this._ordersFromDomain(batch, batchEntity);

    wrap(batchEntity).assign({
      sku: batch.sku,
      quantity: batch.quantity,
      product: productEntity,
      eta: batch.eta,
      allocations: orderEntities,
    });

    return batchEntity;
  }

  static async fromDomain(
    batch: Batch,
    productEntity: ProductEntity,
  ): Promise<BatchEntity> {
    // in _getBatchById method have Collection.matching method
    // matching method cannot use Collection do not have any items, so use count method first
    if (productEntity.batches.count() === 0)
      return this._generateNewBatch(batch, productEntity);

    const batchEntity = await this._getBatchById(batch.batchId, productEntity);
    // if batch record is not in collection, need to generate new BatchEntity
    if (batchEntity === undefined)
      return this._generateNewBatch(batch, productEntity);

    return this._updateBatch(batch, batchEntity, productEntity);
  }

  toDomain(): Batch {
    const batch = new Batch(
      this.batchId,
      this.sku,
      this.quantity,
      this.eta ?? undefined,
    );
    if (this.allocations.isInitialized() === false) return batch;

    batch._allocation = new Set(
      this.allocations.getItems().map((order) => order.toDomain()),
    );
    return batch;
  }
}
