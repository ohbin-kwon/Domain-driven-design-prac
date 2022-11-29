import { setUpMikroOrmSession } from '../../repository/mikroOrm/config/setupOrm';
import { MikroOrmRepository } from '../../repository/mikroOrm/repository';
import config from '../../config';
import { IUnitOfWork } from './IUow';

export async function MikroOrmUow(): Promise<IUnitOfWork> {
  const session = await setUpMikroOrmSession(config.NODE_ENV);
  const repo = MikroOrmRepository(session);

  return {
    batches: repo,
    commit() {
      session.flush();
      return;
    },
    rollback() {
      return;
    },
  };
}
