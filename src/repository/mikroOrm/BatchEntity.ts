import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  ManyToOne,
} from '@mikro-orm/core';
import { Batch, OrderLine } from '../../domain/product';
import { OrderLineEntity } from './OrderLineEntity';
import { ProductEntity } from './ProductEntity';

@Entity()
export class BatchEntity {
  @PrimaryKey({ type: 'text' })
  id!: string;

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
    id: string,
    sku: string,
    quantity: number,
    product: ProductEntity,
    eta?: Date,
  ) {
    this.id = id;
    this.sku = sku;
    this.quantity = quantity;
    this.product = product;
    this.eta = eta;
  }

  static async fromDomain(batch: Batch, product: ProductEntity) {
    const newBatch = new BatchEntity(
      batch.id,
      batch.sku,
      batch.quantity,
      product,
      batch.eta,
    );

    const allocations = [...batch._allocation].map(
      (line) =>
        new OrderLineEntity(line.orderId, line.sku, line.quantity, newBatch),
    );

    for (const entity of allocations) {
      newBatch.allocations.add(entity);
    }
    return newBatch;
  }

  async toDomain(): Promise<Batch> {
    const record = new Batch(this.id, this.sku, this.quantity, this.eta);

    if (this.allocations.isInitialized() === false) return record;

    record._allocation = new Set(
      this.allocations
        .getItems()
        .map((o) => new OrderLine(o.orderId, o.sku, o.quantity)),
    );
    return record;
  }
}
