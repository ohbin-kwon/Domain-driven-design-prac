import { Batch } from '../../domain/batch';
import { IRepository} from '../IRepository'

export function FakeRepository(init: Batch[]): IRepository {
  const repo = init
  return {
    async list(): Promise<Batch[]>{
      return repo
    },
    async get(id: string):Promise<Batch | null> {
      const targetBatch = repo.find(batch => batch.id === id)
      if(targetBatch === undefined) return null
      return targetBatch
    },
    async save(batch: Batch) {
      repo.push(batch)
    }
  }
}