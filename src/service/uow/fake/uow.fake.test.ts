import { Batch } from '../../../domain/batch';
import { withTransaction } from '../../transaction';
import { FakeUow } from './uow.fake';

describe('fake uow test', () => {
  let init: Batch[] = [];

  afterEach(async () => {
    init.splice(0, init.length);
  });
  it('test commit', async () => {
    const uow = FakeUow(init);
    const batch = new Batch('b1', 'CHAIR', 100);
    await withTransaction(uow, async (uow) => {
      await uow.batches.save(batch);
      uow.commit();
    });

    expect(uow.committed).toStrictEqual(true);
  });
  it('test rollback uncommitted work', async () => {
    const uow = FakeUow(init);
    const batch = new Batch('b1', 'CHAIR', 100);
    await withTransaction(uow, async (uow) => {
      await uow.batches.save(batch);
    });

    expect(uow.committed).toStrictEqual(false);
  });
  it('test rollback on error', async () => {
    const uow = FakeUow();
    const batch = new Batch('b1', 'CHAIR', 100);

    try {
      await withTransaction(uow, async (uow) => {
        await uow.batches.save(batch);
        throw new Error('custom error');
      });
    } catch {
      expect(uow.committed).toStrictEqual(false);
    }
  });
});
