import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

@Entity()
export class OrderLineEntity {
  @PrimaryKey({ type: 'int', autoincrement: true })
  id!: number;

  @OneToMany(() => AllocationEntity, b => b.orderLineId)
    allocations = new Collection<AllocationEntity>(this);

  @Property({ type: 'int' })
  orderId: number;

  @Property({ type: 'text' })
  sku: string;

  @Property({ type: 'text' })
  quantity: number;

  constructor(orderId: number, sku: string, quantity: number) {
    this.orderId = orderId;
    this.sku = sku;
    this.quantity = quantity;
  }
}

@Entity()
export class BatchEntity {
  @PrimaryKey({ type: 'text'})
  reference!: string;

  @OneToMany(() => AllocationEntity, b => b.batchId)
    allocations = new Collection<AllocationEntity>(this);

  @Property({ type: 'text' })
  sku: string;

  @Property({ type: 'date', nullable: true })
  eta?: Date;

  constructor(reference: string, sku: string, eta?: Date) {
    this.reference = reference;
    this.sku = sku;
    this.eta = eta;
  }
}

@Entity()
export class AllocationEntity {
  @PrimaryKey({ type: 'int', autoincrement: true })
  id!: number;
  @ManyToOne({ type: 'OrderLine' })
  orderLineId: OrderLineEntity;
  @ManyToOne({ type: 'Batch' })
  batchId: BatchEntity;

  constructor(orderLineId: OrderLineEntity, batchId: BatchEntity) {
    this.orderLineId = orderLineId;
    this.batchId = batchId;
  }
}
