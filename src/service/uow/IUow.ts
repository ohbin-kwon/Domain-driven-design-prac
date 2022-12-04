import { IRepository } from '../../repository/IRepository';

export interface IUnitOfWork {
  products: IRepository;
  enter: () => void;
  commit: () => void;
  rollback: () => void;
  exit: () => void;
}
