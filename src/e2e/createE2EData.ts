import { Batch } from '../domain/batch';
import { IRepository } from '../repository/IRepository';

export async function createE2EData(
  setupRepo: (env: NODE_ENV) => Promise<IRepository>,
  batches: Batch[],
) {
  const repo = await setupRepo('development')
  Promise.all(batches.map(batch => repo.save(batch)))
}
