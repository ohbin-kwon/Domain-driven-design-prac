import { FakeRepository } from '../repository/fake/repository';
import { IRepository } from '../repository/IRepository';
import { service } from './service';
import { IUnitOfWork } from './uow/IUow';
import { fakeUow } from './uow/fake/uow.fake';

// 오케스트레이션을 분리해서 서비스 layer로 분리한다.
describe('allocation service test', () => {
  it('test returns allocations', async () => {
    const uow: IUnitOfWork = fakeUow();
    const batchId = 'b1'
    const sku = 'TABLE';
    const batchQuantity = 100
    const orderId = '1';
    const OrderQuantity = 10;

    await service().addBatch(uow, batchId, sku, batchQuantity)
    
    const result = await service().allocate(uow, orderId, sku, OrderQuantity);
    
    expect(result).toStrictEqual('b1');
  });

  it('test error for invalid sku', async () => {
    const uow: IUnitOfWork = fakeUow();
    const batchId = 'b1'
    const batchSku = 'LAMP'
    const batchQuantity = 100
    const orderId = '1';
    const orderSku = 'CHAIR';
    const orderQuantity = 10;

    await service().addBatch(uow, batchId, batchSku, batchQuantity)
    uow.commit()

    expect(
      async () => await service().allocate(uow, orderId, orderSku, orderQuantity),
    ).rejects.toThrow(new Error('invalid sku - ' + orderSku));
  });
});
