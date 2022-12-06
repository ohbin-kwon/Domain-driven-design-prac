import { Batch, OrderLine, Product } from '../domain/product';
import { IRepository } from './IRepository';
import { MikroOrmRepository } from './mikroOrm/repository';

// this test factory is for repository implementation
// fake repository test is independent
export function createRepoTest(
  label: string,
  setupSession: (env: NODE_ENV) => Promise<SESSION>,
  teardown: (env: NODE_ENV) => Promise<void> = async () => undefined,
) {
  describe(label, () => {
    afterEach(async () => {
      await teardown('test');
    });

    it('test expect null if database is empty ', async () => {
      let repo: IRepository;
      const session = await setupSession('test');
      repo = MikroOrmRepository(session);

      expect(await repo.get({ sku: 'CHAIR' })).toStrictEqual(null);
    });

    it('test expect the product if database has the product ', async () => {
      let repo: IRepository;
      const session = await setupSession('test');
      repo = MikroOrmRepository(session);

      const NEW_BATCH = new Batch(
        'batch-1',
        'CHAIR',
        100,
        new Date('2022-08-13'),
      );
      const NEW_PRODUCT = new Product('CHAIR', [NEW_BATCH]);

      await repo.save(NEW_PRODUCT);
      await session.flush();

      expect(await repo.get({ sku: 'CHAIR' })).toStrictEqual(NEW_PRODUCT);
    });

    it('test expect the product list if database has the products', async () => {
      let repo: IRepository;
      const session = await setupSession('test');
      repo = MikroOrmRepository(session);

      const NEW_BATCH = new Batch(
        'batch-1',
        'CHAIR',
        100,
        new Date('2022-08-13'),
      );
      const SECOND_BATCH = new Batch(
        'batch-2',
        'TABLE',
        100,
        new Date('2022-08-13'),
      );
      const NEW_PRODUCT = new Product('CHAIR', [NEW_BATCH]);
      const SECOND_PRODUCT = new Product('CHAIR', [SECOND_BATCH]);

      await repo.save(NEW_PRODUCT);
      await repo.save(SECOND_PRODUCT);
      await session.flush();

      const batches = await repo.list();

      expect(batches).toStrictEqual([NEW_PRODUCT, SECOND_PRODUCT]);
    });

    it('test expect the product can view order if batch allocated', async () => {
      let repo: IRepository;
      const session = await setupSession('test');
      repo = MikroOrmRepository(session);

      const NEW_LINE = new OrderLine('order-1', 'CHAIR', 50);
      const NEW_BATCH = new Batch(
        'batch-1',
        'CHAIR',
        100,
        new Date('2022-08-13'),
      );
      const NEW_PRODUCT = new Product('CHAIR', [NEW_BATCH]);

      NEW_PRODUCT.allocate(NEW_LINE);

      await repo.save(NEW_PRODUCT);
      await session.flush();

      expect(await repo.get({ sku: 'CHAIR' })).toStrictEqual(NEW_PRODUCT);
    });
  });
}
