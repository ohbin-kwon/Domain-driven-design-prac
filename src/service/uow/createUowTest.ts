import { Batch } from '../../domain/product';
import { withTransaction } from '../transaction';
import { IUnitOfWork } from './IUow';

// this test factory is for Uow implementation, fake Uow
export function createUowTest(
  label: string,
  setUpUow: (
    sessionFunc?: (env: NODE_ENV) => Promise<SESSION>,
  ) => Promise<IUnitOfWork>,
  teardown: (env: NODE_ENV) => Promise<void> = async () => undefined,
) {
  describe(label, () => {
    afterEach(async () => {
      await teardown('test');
    });
    it('test commit', async () => {
      const uow = await setUpUow();
      const batch = new Batch('b1', 'CHAIR', 100);
      await withTransaction(uow, async (uow) => {
        await uow.batches.save(batch);
        uow.commit();
      });

      const list = await uow.batches.list();
      expect(list).toStrictEqual([batch]);
    });
    it('test rollback uncommitted work', async () => {
      const uow = await setUpUow();
      const batch = new Batch('b1', 'CHAIR', 100);
      await withTransaction(uow, async (uow) => {
        await uow.batches.save(batch);
      });

      const list = await uow.batches.list();
      expect(list).toStrictEqual([]);
    });
    it('test rollback on error', async () => {
      const uow = await setUpUow();
      const batch = new Batch('b1', 'CHAIR', 100);

      try {
        await withTransaction(uow, async (uow) => {
          await uow.batches.save(batch);
          throw new Error('custom error');
        });
      } catch {
        const list = await uow.batches.list();
        expect(list).toStrictEqual([]);
      }
    });
  });
}
