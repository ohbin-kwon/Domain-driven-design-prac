import { setUpMikroOrmSession } from '../../../repository/mikroOrm/config/setupOrm';
import { MikroOrmRepository } from '../../../repository/mikroOrm/repository';
import { IUnitOfWork } from '../IUow';
import config from '../../../config';

export async function MikroOrmUow(
  sessionFunc: (env: NODE_ENV) => Promise<SESSION> = setUpMikroOrmSession,
): Promise<IUnitOfWork> {
  const session = await sessionFunc(config.NODE_ENV);
  const repo = MikroOrmRepository(session);
  return {
    products: repo,
    async enter() {},
    async commit() {
      await session.flush();
    },
    async rollback() {},
    exit() {
      session.clear();
    },
  };
}
