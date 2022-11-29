import { IRepository } from "../../repository/IRepository";

export interface IUnitOfWork {
  batches: IRepository,
  commit: () => void,
  rollback: () => void
}