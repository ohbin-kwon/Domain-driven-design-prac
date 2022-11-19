import { allocate, Batch, OrderLine } from "../domain/batch";
import { IRepository } from "../repository/IRepository";
import { IService } from "./IService";

export function service(): IService {
  function isValidSku(sku: string, batches: Batch[]) {
    return batches.find(batch => batch.sku === sku)
  }
  return {
    async allocate(orderLine: OrderLine, repo: IRepository){
      const batchList = await repo.list()
      const validSku = isValidSku(orderLine.sku, batchList)
      
      if(validSku === undefined) return 'invalid sku'

      const batchId = allocate(orderLine, batchList)
      return batchId
    }
  }
}