import { Batch, Product } from '../../domain/product';
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
      const product = new Product('CHAIR', [batch])

      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
        await uow.commit();
      });

      const list = await uow.products.list();
      expect(list).toStrictEqual([product]);
    });
    it('test rollback uncommitted work', async () => {
      const uow = await setUpUow();
      const batch = new Batch('b1', 'CHAIR', 100);
      const product = new Product('CHAIR', [batch])

      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
      });

      const list = await uow.products.list();
      expect(list).toStrictEqual([]);
    });
    it('test rollback on error', async () => {
      const uow = await setUpUow();
      const batch = new Batch('b1', 'CHAIR', 100);
      const product = new Product('CHAIR', [batch])

      try {
        await withTransaction(uow, async (uow) => {
          await uow.products.save(product);
          throw new Error('custom error');
        });
      } catch {
        const list = await uow.products.list();
        expect(list).toStrictEqual([]);
      }
    });
  });
}
