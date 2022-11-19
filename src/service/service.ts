import { OrderLine } from "../domain/batch";
import { IRepository } from "../repository/IRepository";
import { IService } from "./IService";

export function service(): IService {
  return {
    async allocate(orderLine: OrderLine, repo: IRepository){
      return ''
    }
  }
}