import { IUnitOfWork } from './uow/IUow';

export interface IService {
  allocate: (
    uow: IUnitOfWork,
    orderId: string,
    sku: string,
    quantity: number,
  ) => Promise<string>;
  addBatch: (
    uow: IUnitOfWork,
    id: string,
    sku: string,
    quantity: number,
    eta?: Date,
  ) => Promise<void>;
}
