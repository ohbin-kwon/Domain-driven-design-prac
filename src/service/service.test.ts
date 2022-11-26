import { FakeRepository } from '../repository/fake/repository';
import { IRepository } from '../repository/IRepository';
import { service } from './service';

// 오케스트레이션을 분리해서 서비스 layer로 분리한다.
describe('allocation service test', () => {
  it('test returns allocations', async () => {
    const repo: IRepository = FakeRepository([]);
    const batchId = 'b1'
    const sku = 'TABLE';
    const batchQuantity = 100
    const orderId = '1';
    const OrderQuantity = 10;

    await service().addBatch(repo, batchId, sku, batchQuantity)

    const result = await service().allocate(repo, orderId, sku, OrderQuantity);

    expect(result).toStrictEqual('b1');
  });

  it('test error for invalid sku', async () => {
    const repo: IRepository = FakeRepository([]);
    const batchId = 'b1'
    const batchSku = 'LAMP'
    const batchQuantity = 100
    const orderId = '1';
    const orderSku = 'CHAIR';
    const orderQuantity = 10;

    await service().addBatch(repo, batchId, batchSku, batchQuantity)

    expect(
      async () => await service().allocate(repo, orderId, orderSku, orderQuantity),
    ).rejects.toThrow(new Error('invalid sku - ' + orderSku));
  });
});
