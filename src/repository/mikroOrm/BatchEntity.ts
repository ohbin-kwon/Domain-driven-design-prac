import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Batch, OrderLine } from '../../domain/batch';
import { OrderLineEntity } from './OrderLineEntity';

@Entity()
export class BatchEntity {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @OneToMany('OrderLineEntity', 'batch')
  allocations = new Collection<OrderLineEntity>(this);

  @Property({ type: 'text' })
  sku: string;

  @Property({ type: 'int' })
  quantity: number;

  @Property({ type: 'date', nullable: true })
  eta?: Date;

  constructor(id: string, sku: string, quantity: number, eta?: Date) {
    this.id = id;
    this.sku = sku;
    this.quantity = quantity;
    this.eta = eta;
  }

  static async fromDomain(batch: Batch) {
    const newBatch = new BatchEntity(
      batch.id,
      batch.sku,
      batch.quantity,
      batch.eta,
    );
    
    const allocations = [...batch._allocation].map(line => new OrderLineEntity(
      line.orderId,
      line.sku,
      line.quantity,
      newBatch
    ));

    for (const entity of allocations){
      newBatch.allocations.add(entity)
    }
    return newBatch
  }

  async toDomain(): Promise<Batch> {
    const record = new Batch(this.id, this.sku, this.quantity, this.eta);
    
    if(this.allocations.isInitialized() === false) return record
    
    record._allocation = new Set(this.allocations.getItems().map(o => new OrderLine(o.orderId, o.sku, o.quantity)));
    return record;
  }
}
