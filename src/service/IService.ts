import { IRepository } from '../repository/IRepository';

export interface IService {
  allocate: (
    orderId: string,
    sku: string,
    quantity: number,
    repo: IRepository,
  ) => Promise<string>;
}
