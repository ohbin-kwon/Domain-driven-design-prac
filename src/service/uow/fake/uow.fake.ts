import { IUnitOfWork } from '../IUow';
import { FakeRepository } from '../../../repository/fake/repository';

export function FakeUow(): IUnitOfWork {
  const repo = FakeRepository([])

  return {
    batches: repo,
    commit() {
      return;
    },
    rollback() {
      return;
    },
  };
}
