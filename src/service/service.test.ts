import { Batch } from '../domain/batch';
import { FakeRepository } from '../repository/fake/repository';
import { IRepository } from '../repository/IRepository';
import { service } from './service';

// 오케스트레이션을 분리해서 서비스 layer로 분리한다.
describe('allocation service test', () => {
  it('test returns allocations', async () => {
    const orderId = '1';
    const sku = 'TABLE';
    const quantity = 10;
    const batch = new Batch('b1', 'TABLE', 100);
    const repo: IRepository = FakeRepository([batch]);

    const result = await service().allocate(repo, orderId, sku, quantity);

    expect(result).toStrictEqual('b1');
  });

  it('test error for invalid sku', async () => {
    const orderId = '1';
    const sku = 'CHAIR';
    const quantity = 10;
    const batch = new Batch('b1', 'LAMP', 100);
    const repo: IRepository = FakeRepository([batch]);

    expect(
      async () => await service().allocate(repo, orderId, sku, quantity),
    ).rejects.toThrow(new Error('invalid sku - ' + sku));
  });

  it('test_add_batch', async () => {
    const repo: IRepository = FakeRepository([])
    await service().addBatch(repo, 'b1', "CHAIR", 100)
    expect(await repo.get('b1')).toStrictEqual(new Batch('b1', "CHAIR", 100))
  })
});
