import { Batch, OrderLine, Product } from '../../domain/product';
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
      const product = new Product('CHAIR', [batch]);

      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
        await uow.commit();
      });

      const list = await uow.products.list();
      const resultProduct = new Product('CHAIR', [batch], 1)
      expect(list).toStrictEqual([resultProduct]);
    });
    it('test rollback uncommitted work', async () => {
      const uow = await setUpUow();
      const batch = new Batch('b1', 'CHAIR', 100);
      const product = new Product('CHAIR', [batch]);

      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
      });

      const list = await uow.products.list();
      expect(list).toStrictEqual([]);
    });
    it('test rollback on error', async () => {
      const uow = await setUpUow();
      const batch = new Batch('b1', 'CHAIR', 100);
      const product = new Product('CHAIR', [batch]);

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

    const addProduct = async (uow: IUnitOfWork, product: Product) => {
      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
        await uow.commit();
      });
    };

    const tryAllocate = async (
      uow: IUnitOfWork,
      orderId: string,
      sku: string,
    ) => {
      const LINE = new OrderLine(orderId, sku, 10);

      await withTransaction(uow, async (uow) => {
        const product = await uow.products.get({ sku: 'TABLE' });

        if (product === null) return new Error('');
        product.allocate(LINE);
        await uow.products.save(product);
        await uow.commit();
      });
    };

    it('test concurrent updates to version are not allowed: sync', async () => {
      const uow = await setUpUow();

      await addProduct(
        uow,
        new Product('TABLE', [new Batch('b1', 'TABLE', 100)]),
      );

      await tryAllocate(uow, 'o1', 'TABLE');
      await tryAllocate(uow, 'o2', 'TABLE');

      const product = await uow.products.get({ sku: 'TABLE' });
      
      expect(product?.batches[0]._allocation.size).toStrictEqual(2);
    });

    it('test concurrent updates to version are not allowed: async', async () => {
      const uow = await setUpUow();

      await addProduct(
        uow,
        new Product('TABLE', [new Batch('b1', 'TABLE', 100)]),
      );
      await Promise.all([
        tryAllocate(uow, 'o1', 'TABLE'),
        tryAllocate(uow, 'o2', 'TABLE'),
      ]);

      const product = await uow.products.get({ sku: 'TABLE' });
      
      expect(product?.batches[0]._allocation.size).toStrictEqual(1);
    });
  });
}
