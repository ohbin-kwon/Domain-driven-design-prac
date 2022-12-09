import { MikroOrmRepository } from '../../../repository/mikroOrm/repository';
import { IUnitOfWork } from '../IUow';
import config from '../../../config';
import { IsolationLevel } from '@mikro-orm/core';

export async function MikroOrmUow(
  sessionFunc: (env: NODE_ENV) => Promise<SESSION>,
): Promise<IUnitOfWork> {
  const session = await sessionFunc(config.NODE_ENV);
  const repo = MikroOrmRepository(session);
  let _closed = false;
  return {
    products: repo,
    async enter() {
      await session.begin({isolationLevel: IsolationLevel.REPEATABLE_READ});
    },
    async commit() {
      if (_closed === false){
        // isolation level을 설정하면 commit이 되지 않고 concurrent error를 발생시킨다.
        // 따라서 rollback이 진행된다.
        await session.commit();
        _closed = true;
      }
    },
    async rollback() {
      if (_closed === false){
        await session.rollback();
        _closed = true;
      }
    },
    async exit() {
      if (_closed === false){
        await session.rollback();
        _closed = true;
      }
      session.clear();
    },
  };
}
