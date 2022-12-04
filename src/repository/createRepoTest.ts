import { Batch, Product } from '../domain/product';
import { IRepository } from './IRepository';
import { MikroOrmRepository } from './mikroOrm/repository';

const NEW_BATCH = new Batch('batch-1', 'CHAIR', 100, new Date('2022-08-13'));
const NEW_PRODUCT = new Product('CHAIR', [NEW_BATCH])
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

    it('batch test', async () => {
      let repo: IRepository;
      const session = await setupSession('test');
      repo = MikroOrmRepository(session);

      expect(await repo.get({ sku: 'CHAIR' })).toStrictEqual(null);

      await repo.save(NEW_PRODUCT);
      session.flush();

      expect(await repo.get({ sku: 'CHAIR' })).toStrictEqual(NEW_PRODUCT);

      const batches = await repo.list();

      expect(batches).toStrictEqual([NEW_PRODUCT]);
    });
  });
}
