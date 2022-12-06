import { IRepository } from '../../repository/IRepository';

export interface IUnitOfWork {
  products: IRepository;
  enter: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  exit: () => void;
}
