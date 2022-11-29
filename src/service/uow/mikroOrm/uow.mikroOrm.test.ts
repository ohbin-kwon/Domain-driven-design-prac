import { Batch } from "../../../domain/batch";
import { tearDownMikroOrm } from "../../../repository/mikroOrm/config/setupOrm";
import { MikroOrmUow } from "./uow.mikroOrm";

describe('allocation service test', () => {
  afterEach(async () => {
    await tearDownMikroOrm('test');
  });
  it('test commit', async () => {
    const batch = new Batch('b1', 'CHAIR', 100)
    const uow = await MikroOrmUow()
    await uow.batches.save(batch)
    uow.commit()

    const list = await uow.batches.list()
    expect(list).toStrictEqual([batch])
  });
  it('test rollback uncommitted work', async () => {
    const batch = new Batch('b1', 'CHAIR', 100)
    const uow = await MikroOrmUow()
    await uow.batches.save(batch)

    const list = await uow.batches.list()
    expect(list).toStrictEqual([])
  });
});
