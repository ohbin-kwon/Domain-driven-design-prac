import { Batch, Product } from '../../../domain/product';
import { withTransaction } from '../../transaction';
import { FakeUow } from './uow.fake';

describe('fake uow test', () => {
  let init: Product[] = [];

  afterEach(async () => {
    init.splice(0, init.length);
  });
  it('test commit', async () => {
    const uow = FakeUow(init);
    const batch = new Batch('b1', 'CHAIR', 100);
    const product = new Product('CHAIR', [batch]);
    await withTransaction(uow, async (uow) => {
      await uow.products.save(product);
      uow.commit();
    });

    expect(uow.committed).toStrictEqual(true);
  });
  it('test rollback uncommitted work', async () => {
    const uow = FakeUow(init);
    const batch = new Batch('b1', 'CHAIR', 100);
    const product = new Product('CHAIR', [batch]);
    await withTransaction(uow, async (uow) => {
      await uow.products.save(product);
    });

    expect(uow.committed).toStrictEqual(false);
  });
  it('test rollback on error', async () => {
    const uow = FakeUow();
    const batch = new Batch('b1', 'CHAIR', 100);
    const product = new Product('CHAIR', [batch]);

    try {
      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
        throw new Error('custom error');
      });
    } catch {
      expect(uow.committed).toStrictEqual(false);
    }
  });
});
