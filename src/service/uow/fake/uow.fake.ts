import { IUnitOfWork } from '../IUow';
import { FakeRepository } from '../../../repository/fake/repository';

export function FakeUow(): IUnitOfWork {
  const repo = FakeRepository([])

  return {
    batches: repo,
    enter() {},
    commit() {},
    rollback() {},
    exit() {}
  };
}
