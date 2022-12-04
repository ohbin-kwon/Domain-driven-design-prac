import { Batch, OrderLine, Product } from '../domain/product';
import { IService } from './IService';
import { withTransaction } from './transaction';
import { IUnitOfWork } from './uow/IUow';

export function service(): IService {
  return {
    async allocate(
      uow: IUnitOfWork,
      orderId: string,
      sku: string,
      quantity: number,
    ) {
      const line = new OrderLine(orderId, sku, quantity);

      const batchId = await withTransaction<string>(uow, async (uow) => {
        const product = await uow.products.get({ sku: line.sku });

        if (product === null) throw new Error('invalid sku - ' + sku);

        const batchId = product.allocate(line);
        uow.commit();
        return batchId;
      });

      return batchId;
    },
    async addBatch(
      uow: IUnitOfWork,
      id: string,
      sku: string,
      quantity: number,
      eta?: Date,
    ) {
      await withTransaction(uow, async (uow) => {
        let product = await uow.products.get({ sku });
        if (product === null) {
          product = new Product(sku, []);
          uow.products.save(product);
        }
        product.batches.push(new Batch(id, sku, quantity, eta));
        uow.commit();
      });
    },
  };
}
