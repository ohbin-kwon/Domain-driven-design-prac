import { allocate, Batch, OrderLine } from '../domain/batch';
import { IService } from './IService';
import { withTransaction } from './transaction';
import { IUnitOfWork } from './uow/IUow';

export function service(): IService {
  function isValidSku(sku: string, batches: Batch[]) {
    return batches.find((batch) => batch.sku === sku);
  }
  return {
    async allocate(
      uow: IUnitOfWork,
      orderId: string,
      sku: string,
      quantity: number,
    ) {
      const batchId = await withTransaction<string>(uow, async (uow) => {
        const batchList = await uow.batches.list();

        const validSku = isValidSku(sku, batchList);
        if (validSku === undefined) throw new Error('invalid sku - ' + sku);

        const line = new OrderLine(orderId, sku, quantity);

        const batchId = allocate(line, batchList);
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
        await uow.batches.save(new Batch(id, sku, quantity, eta));
        uow.commit();
      });
    },
    async reAllocate(
      uow: IUnitOfWork,
      orderId: string,
      sku: string,
      quantity: number,
    ) {
      const line = new OrderLine(orderId, sku, quantity);
      await withTransaction(uow, async (uow) => {
        const batch = await uow.batches.get({ sku });
        if (batch === null) throw new Error('invalid sku - ' + sku);
        batch.deallocate(line);
        allocate(line, [batch]);
        uow.commit();
      });
    },
  };
}
