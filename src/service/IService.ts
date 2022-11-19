import { OrderLine } from "../domain/batch";
import { IRepository } from "../repository/IRepository";

export interface IService {
  allocate: (orderLine: OrderLine, repo: IRepository) => Promise<string>
}