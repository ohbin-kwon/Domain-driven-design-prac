import { allocate, Batch } from '../domain/batch';
import { IRepository } from '../repository/IRepository';
import { IService } from './IService';

export function service(): IService {
  function isValidSku(sku: string, batches: Batch[]) {
    return batches.find((batch) => batch.sku === sku);
  }
  return {
    async allocate(
      orderId: string,
      sku: string,
      quantity: number,
      repo: IRepository,
    ) {
      const batchList = await repo.list();

      const validSku = isValidSku(sku, batchList);
      if (validSku === undefined) throw new Error('invalid sku - ' + sku);

      const batchId = allocate(orderId, sku, quantity, batchList);

      return batchId;
    },
  };
}
