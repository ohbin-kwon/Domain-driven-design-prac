import { IUnitOfWork } from '../IUow';
import { FakeRepository } from '../../../repository/fake/repository';
import { Product } from '../../../domain/product';

export function FakeUow(
  session: Product[] = [],
): IUnitOfWork & { committed: boolean } {
  const repo = FakeRepository(session);
  return {
    committed: false,
    products: repo,
    enter() {},
    commit() {
      this.committed = true;
    },
    rollback() {},
    exit() {},
  };
}
