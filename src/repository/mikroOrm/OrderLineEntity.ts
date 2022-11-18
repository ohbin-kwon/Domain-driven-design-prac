import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne
  } from '@mikro-orm/core';
  import { OrderLine } from '../../domain/batch';
  import type { BatchEntity } from './BatchEntity';
  
  @Entity()
  export class OrderLineEntity {
      @PrimaryKey({ type: 'int', autoincrement: true })
      id!: number;
  
      @Property({ type: 'int' })
      orderId: number;
  
      @Property({ type: 'text' })
      sku: string;
  
      @Property({ type: 'int' })
      quantity: number;
  
      @ManyToOne('BatchEntity')
      batch!: BatchEntity;
  
      constructor(orderId: number, sku: string, quantity: number, batch: BatchEntity) {
          this.orderId = orderId;
          this.sku = sku;
          this.quantity = quantity;
          this.batch = batch;
      }
  
      toDomain(): OrderLine {
          const record = new OrderLine(this.orderId, this.sku, this.quantity);
          return record;
      }
  }
  