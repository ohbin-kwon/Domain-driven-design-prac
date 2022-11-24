import { Batch } from './domain/batch';
import { IRepository } from './repository/IRepository';

export async function createE2EData(
  setupRepo: () => Promise<IRepository>,
  batches: Batch[],
) {
  const repo = await setupRepo()
  Promise.all(batches.map(batch => repo.save(batch)))
}
