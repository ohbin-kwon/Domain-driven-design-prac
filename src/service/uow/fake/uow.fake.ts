import { IUnitOfWork } from '../IUow';
import { FakeRepository } from '../../../repository/fake/repository';
import { Batch } from '../../../domain/batch';

export function FakeUow(
  session: Batch[] = [],
): IUnitOfWork & { committed: boolean } {
  const repo = FakeRepository(session);
  return {
    committed: false,
    batches: repo,
    enter() {},
    commit() {
      this.committed = true;
    },
    rollback() {},
    exit() {},
  };
}
