import { allocate, Batch, OrderLine } from "../domain/batch";
import { IRepository } from "../repository/IRepository";
import { IService } from "./IService";

export function service(): IService {
  function isValidSku(sku: string, batches: Batch[]) {
    return batches.find(batch => batch.sku === sku)
  }
  return {
    async allocate(line: OrderLine, repo: IRepository){
      const batchList = await repo.list()

      const validSku = isValidSku(line.sku, batchList)
      if(validSku === undefined) throw new Error('invalid sku - ' + line.sku)

      const batchId = allocate(line, batchList)
      
      return batchId
    }
  }
}