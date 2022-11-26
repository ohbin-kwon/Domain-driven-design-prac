import { OrderLine } from '../domain/batch';
import { IRepository } from '../repository/IRepository';

export interface IService {
  allocate: (
    orderId: string,
    sku: string,
    quantity: number,
    repo: IRepository,
  ) => Promise<string>;
  addBatch: (
    repo: IRepository,
    id: string,
    sku: string,
    quantity: number,
    eta?: Date,
  ) => Promise<void>;
}
