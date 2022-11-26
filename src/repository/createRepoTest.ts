import { Batch } from '../domain/batch';
import { IRepository } from './IRepository';

const NEW_BATCH = new Batch(
  'batch-1',
  'CHAIR',
  100,
  new Date('2022-08-13'),
);

export function createRepoTest(
  label: string,
  setupRepo: (env: NODE_ENV) => Promise<IRepository>,
  teardown: (env: NODE_ENV) => Promise<void> = async () => undefined,
) {
  describe(label, () => {
    afterEach(async () => {
      await teardown('test');
    });

    it('batch test', async () => {
      const repo = await setupRepo('test');

      expect(await repo.get('batch-1')).toStrictEqual(null);

      await repo.save(NEW_BATCH);

      expect(await repo.get('batch-1')).toStrictEqual(NEW_BATCH);

      const batches = await repo.list()

      expect(batches).toStrictEqual([NEW_BATCH]);
    });
  });
}
