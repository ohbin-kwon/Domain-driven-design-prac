import { Batch } from '../domain/batch';
import { IRepository } from './IRepository';
import { MikroOrmRepository } from './mikroOrm/repository';

const NEW_BATCH = new Batch('batch-1', 'CHAIR', 100, new Date('2022-08-13'));
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

      expect(await repo.get('batch-1')).toStrictEqual(null);

      await repo.save(NEW_BATCH);
      session.flush();

      expect(await repo.get('batch-1')).toStrictEqual(NEW_BATCH);

      const batches = await repo.list();

      expect(batches).toStrictEqual([NEW_BATCH]);
    });
  });
}
