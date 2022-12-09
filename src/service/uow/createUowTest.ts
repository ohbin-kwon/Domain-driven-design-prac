import { Batch, OrderLine, Product } from '../../domain/product';
import { withTransaction } from '../transaction';
import { IUnitOfWork } from './IUow';
import { OrderLineEntity } from '../../repository/mikroOrm/OrderLineEntity';
import { BatchEntity } from '../../repository/mikroOrm/BatchEntity';
import { ProductEntity } from '../../repository/mikroOrm/ProductEntity';

// this test factory is for Uow implementation, fake Uow
export function createUowTest(
  label: string,
  connect: () => Promise<void>,
  setupSession: () => Promise<SESSION>, 
  setUpUow: (
    setupSession: () => Promise<SESSION>,
  ) => Promise<IUnitOfWork>,
  teardown: () => Promise<void> = async () => undefined,
) {
  describe(label, () => {
    beforeAll(async () => {
      await connect();
    })

    afterAll(async () => {
      await teardown();
    });

    afterEach(async () => {
      const session = await setupSession();
      await session.createQueryBuilder(OrderLineEntity).delete().execute();
      await session.createQueryBuilder(BatchEntity).delete().execute();
      await session.createQueryBuilder(ProductEntity).delete().execute();
    });
    
    it('test commit', async () => {
      const uow = await setUpUow(setupSession);
      const batch = new Batch('b1', 'CHAIR', 100);
      const product = new Product('CHAIR', [batch]);

      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
        await uow.commit();
      });

      const uow2 = await setUpUow(setupSession);
      const list = await uow2.products.list();
      const resultProduct = new Product('CHAIR', [batch])
      expect(list).toStrictEqual([resultProduct]);
    });

    it('test rollback uncommitted work', async () => {
      const uow = await setUpUow(setupSession);
      const batch = new Batch('b1', 'CHAIR', 100);
      const product = new Product('CHAIR', [batch]);

      await withTransaction(uow, async (uow) => {
        await uow.products.save(product);
      });

      const uow2 = await setUpUow(setupSession);
      const list = await uow2.products.list();
      expect(list).toStrictEqual([]);
    });

    it('test rollback on error', async () => {

      try {
        const uow = await setUpUow(setupSession);
        await withTransaction(uow, async (uow) => {
          const batch = new Batch('b1', 'CHAIR', 100);
          const product = new Product('CHAIR', [batch]);
          await uow.products.save(product);
          throw new Error('custom error');
        });
      } catch {
        const uow2 = await setUpUow(setupSession);
        const list = await uow2.products.list();
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

    it('test not concurrent updates to version are allowed: sync', async () => {
      const uow = await setUpUow(setupSession);

      await addProduct(
        uow,
        new Product('TABLE', [new Batch('b1', 'TABLE', 100)]),
      );

      const uow2 = await setUpUow(setupSession);
      const uow3 = await setUpUow(setupSession);
      await tryAllocate(uow2, 'o1', 'TABLE');
      await tryAllocate(uow3, 'o2', 'TABLE');

      const uow4 = await setUpUow(setupSession);
      const product = await uow4.products.get({ sku: 'TABLE' });
      
      expect(product?.versionNumber).toBe(2)
      expect(product?.batches[0]._allocation.size).toStrictEqual(2);
    });

    it('test concurrent updates to version are not allowed: async', async () => {
      const uow = await setUpUow(setupSession);

      await addProduct(
        uow,
        new Product('TABLE', [new Batch('b1', 'TABLE', 100)]),
      );
      const errors: Error[] =[];
      
      const uow2 = await setUpUow(setupSession);
      const uow3 = await setUpUow(setupSession);
      await Promise.all([
        tryAllocate(uow2, 'o1', 'TABLE').catch(e => {
          errors.push(e);
        }),
        tryAllocate(uow3, 'o2', 'TABLE').catch(e => {
          errors.push(e)
        }),
      ]);

      const uow4 = await setUpUow(setupSession);
      const product = await uow4.products.get({ sku: 'TABLE' });

      expect(product?.versionNumber).toBe(1)
      expect(product?.batches[0]._allocation.size).toStrictEqual(1);
      expect(errors).toHaveLength(1);
    });
  });
}
