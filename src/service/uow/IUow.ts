import { IRepository } from '../../repository/IRepository';

export interface IUnitOfWork {
  batches: IRepository;
  enter: () => void;
  commit: () => void;
  rollback: () => void;
  exit: () => void;
}
