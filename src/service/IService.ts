import { OrderLine } from "../domain/batch";
import { IRepository } from "../repository/IRepository";

export interface IService {
  allocate: (line: OrderLine, repo: IRepository) => Promise<string>
}