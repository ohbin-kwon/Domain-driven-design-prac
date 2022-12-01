import { IUnitOfWork } from './uow/IUow';

export async function withTransaction<T>(
  uow: IUnitOfWork,
  job: (uow: IUnitOfWork) => Promise<T>,
) {
  try {
    uow.enter();
    return await job(uow);
  } catch (e) {
    uow.rollback();
    throw e;
  } finally {
    uow.exit();
  }
}
