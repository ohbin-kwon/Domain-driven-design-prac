import { Batch } from "../../domain/batch";
import { IRepository } from "../IRepository";
import { FakeRepository } from "./repository";

const NEW_BATCH = new Batch(
  'batch-1',
  'CHAIR',
  100,
  new Date('2022-08-13'),
);

describe('fakeRepoTest', () => {
  let init: Batch[] = []

  afterEach(async () => {
    init.splice(0, init.length)
  });

  it('batch test', async () => {
    let repo: IRepository = FakeRepository(init);

    expect(await repo.get('batch-1')).toStrictEqual(null);

    await repo.save(NEW_BATCH);

    expect(await repo.get('batch-1')).toStrictEqual(NEW_BATCH);

    const batches = await repo.list()

    expect(batches).toStrictEqual([NEW_BATCH]);
  });
});