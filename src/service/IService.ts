import { OrderLine } from '../domain/batch';
import { IRepository } from '../repository/IRepository';

export interface IService {
  allocate: (
    repo: IRepository,
    orderId: string,
    sku: string,
    quantity: number,
  ) => Promise<string>;
  addBatch: (
    repo: IRepository,
    id: string,
    sku: string,
    quantity: number,
    eta?: Date,
  ) => Promise<void>;
}
