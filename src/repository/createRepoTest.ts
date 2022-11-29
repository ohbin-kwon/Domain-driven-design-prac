import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
import { Batch } from '../domain/batch';
import { IRepository } from './IRepository';
import { MikroOrmRepository } from './mikroOrm/repository';
import { FakeRepository } from './fake/repository';

const NEW_BATCH = new Batch(
  'batch-1',
  'CHAIR',
  100,
  new Date('2022-08-13'),
);


export function createRepoTest(
  label: string,
  setupSession: (env: NODE_ENV) => Promise<SESSION>,
  teardown: (env: NODE_ENV) => Promise<void> = async () => undefined,
) {
  describe(label, () => {
    function isMikroOrmSession(session: SESSION): session is SqlEntityManager<PostgreSqlDriver>{
      return session instanceof SqlEntityManager<PostgreSqlDriver>
    }
    afterEach(async () => {
      await teardown('test');
    });

    it('batch test', async () => {
      let repo: IRepository;
      const session = await setupSession('test')
      console.log(isMikroOrmSession(session))
      if(!isMikroOrmSession(session)) return
      repo = MikroOrmRepository(session) 

      // if(isMikroOrmSession(session)){
      //   repo = MikroOrmRepository(session) 
      // }
      // else{
      //   repo = FakeRepository(session)
      // }

      expect(await repo.get('batch-1')).toStrictEqual(null);

      await repo.save(NEW_BATCH);
      session.flush()

      expect(await repo.get('batch-1')).toStrictEqual(NEW_BATCH);

      const batches = await repo.list()

      expect(batches).toStrictEqual([NEW_BATCH]);
    });
  });
}
