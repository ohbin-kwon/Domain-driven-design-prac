import { IUnitOfWork } from './uow/IUow';

export async function withTransaction<T>(
  uow: IUnitOfWork,
  job: (uow: IUnitOfWork) => Promise<T>,
) {
  try {
    await uow.enter();
    return await job(uow);
  } catch (e) {
    await uow.rollback();
    throw e;
  } finally {
    await uow.exit();
  }
}
