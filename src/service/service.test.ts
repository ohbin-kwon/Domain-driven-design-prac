import { Batch, OrderLine } from '../domain/batch';
import { FakeRepository } from '../repository/fake/repository';
import { IRepository } from '../repository/IRepository';
import { service } from './service';

// 오케스트레이션을 분리해서 서비스 layer로 분리한다.
describe('allocation service test', () => {
  it('test returns allocations', async () => {
    const line = new OrderLine('1', 'TABLE', 10);
    const batch = new Batch('b1', 'TABLE', 100);
    const repo: IRepository = FakeRepository([batch]);

    const result = await service().allocate(line, repo);

    expect(result).toStrictEqual('b1');
  });

  it('test error for invalid sku', async () => {
    const line = new OrderLine('1', 'CHAIR', 10);
    const batch = new Batch('b1', 'LAMP', 100);
    const repo: IRepository = FakeRepository([batch]);

    const result = await service().allocate(line, repo);
    expect(result).toStrictEqual('invalid sku');
  });
});
