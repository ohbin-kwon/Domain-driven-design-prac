import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { OrderLine } from '../../domain/product';
import type { BatchEntity } from './BatchEntity';

@Entity()
export class OrderLineEntity {
  @PrimaryKey({ type: 'text' })
  orderId: string;

  @Property({ type: 'text' })
  sku: string;

  @Property({ type: 'int' })
  quantity: number;

  @ManyToOne('BatchEntity')
  batch!: BatchEntity;

  constructor(
    orderId: string,
    sku: string,
    quantity: number,
    batch: BatchEntity,
  ) {
    this.orderId = orderId;
    this.sku = sku;
    this.quantity = quantity;
    this.batch = batch;
  }

  private static async _getBatchById(
    orderId: string,
    batchEntity: BatchEntity,
  ): Promise<OrderLineEntity | undefined> {
    const lineEntity = (
      await batchEntity.allocations.matching({
        where: { orderId },
      })
    )[0];
    return lineEntity;
  }

  private static _generateNewLine(line: OrderLine, batchEntity: BatchEntity) {
    const newLineEntity = new OrderLineEntity(
      line.orderId,
      line.sku,
      line.quantity,
      batchEntity,
    );

    return newLineEntity;
  }

  static async fromDomain(line: OrderLine, batchEntity: BatchEntity) {
    if (batchEntity.allocations.count() === 0)
      return this._generateNewLine(line, batchEntity);

    const lineEntity = await this._getBatchById(line.orderId, batchEntity);

    if (lineEntity === undefined)
      return this._generateNewLine(line, batchEntity);

    return lineEntity;
  }

  toDomain(): OrderLine {
    const record = new OrderLine(this.orderId, this.sku, this.quantity);
    return record;
  }
}
