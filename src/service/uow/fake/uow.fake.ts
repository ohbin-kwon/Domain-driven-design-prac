import { IUnitOfWork } from '../IUow';
import { FakeRepository } from '../../../repository/fake/repository';

export function fakeUow(): IUnitOfWork {
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
