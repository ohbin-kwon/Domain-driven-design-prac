import { Batch, OrderLine, allocate } from './batch';
// batchQuantity, lineQuantity에 맞는 batch와 line을 만들어내는 함수
function makeBatchAndLine(
  sku: string,
  batchQuantity: number,
  lineQuantity: number,
): [Batch, OrderLine] {
  return [
    new Batch('batch-001', sku, batchQuantity, new Date('2022-08-25')),
    Object.freeze(new OrderLine('1', sku, lineQuantity)),
  ];
}
describe('allocate test', () => {
  // required보다 available이 많은 경우 할당할 수 있다.
  test('test can allocate if available greater than required', () => {
    const [largeBatch, smallLine] = makeBatchAndLine('LAMP', 20, 2);
    expect(largeBatch.canAllocate(smallLine)).toBe('success');
  });
  // required보다 available이 적은 경우 할당할 수 없다.
  test('test cannot allocate if available smaller than required', () => {
    const [smallBatch, largeLine] = makeBatchAndLine('LAMP', 2, 20);
    expect(smallBatch.canAllocate(largeLine)).toBe('out of stock');
  });

  // required와 available이 같다면 할당 할 수 있다.
  test('test can allocate if available equal to required', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 2, 2);
    expect(batch.canAllocate(line)).toBe('success');
  });

  // batch와 line의 sku가 다르다면 할당 할 수 없다.
  test('test cannot allocate if batch sku and line sku do not match', () => {
    const batch = new Batch('batch-001', 'LAMP', 100, new Date('2022-08-25'));
    const differentSkuLine = new OrderLine('1', 'CHAIR', 10);
    Object.freeze(differentSkuLine);
    expect(batch.canAllocate(differentSkuLine)).toBe('sku is different');
  });

  test('test allocating to a batch reduces the available quantity', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 20, 2);
    batch.allocate(line);

    expect(batch.availableQuantity).toBe(18);
  });
});

describe('deallocate test', () => {
  test('test can allocate allocated lines', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 20, 2);
    batch.allocate(line);
    batch.deallocate(line);
    expect(batch.availableQuantity).toBe(20);
  });

  test('test can only deallocate allocated lines', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 20, 2);
    const unallocatedLine = new OrderLine('1', 'SMALL-TABLE', 3);
    Object.freeze(unallocatedLine);

    batch.allocate(line);
    batch.deallocate(unallocatedLine);
    expect(batch.availableQuantity).toBe(18);
  });

  test('test allocation is idempotent', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 20, 2);
    batch.allocate(line);
    batch.allocate(line);
    expect(batch.availableQuantity).toBe(18);
  });
});

describe('domain function(allocate line to batch) test', () => {
  test('test prefers current stock batches to shipment', () => {
    const inStockBatch = new Batch('in-stock-batch', 'CLOCK', 100);
    const shipmentBatch = new Batch(
      'shipment-batch',
      'CLOCK',
      100,
      new Date('2022-08-25'),
    );
    const line = new OrderLine('1', 'CLOCK', 10);

    allocate(line, [inStockBatch, shipmentBatch]);

    expect(inStockBatch.availableQuantity).toBe(90);
    expect(shipmentBatch.availableQuantity).toBe(100);
  });

  test('test prefers earlier batches', () => {
    const earliest = new Batch(
      'earliest-batch',
      'CLOCK',
      100,
      new Date('2022-08-25'),
    );
    const medium = new Batch(
      'medium-batch',
      'CLOCK',
      100,
      new Date('2022-08-26'),
    );
    const latest = new Batch(
      'latest-batch',
      'CLOCK',
      100,
      new Date('2022-08-27'),
    );
    const line = new OrderLine('1', 'CLOCK', 10);

    allocate(line, [earliest, medium, latest]);

    expect(earliest.availableQuantity).toBe(90);
    expect(medium.availableQuantity).toBe(100);
    expect(latest.availableQuantity).toBe(100);
  });

  test('test returns allocated batch id', () => {
    const inStockBatch = new Batch('in-stock-batch', 'CLOCK', 100);
    const shipmentBatch = new Batch(
      'shipment-batch',
      'CLOCK',
      100,
      new Date('2022-08-25'),
    );
    const line = new OrderLine('1', 'CLOCK', 10);

    const allocation = allocate(line, [inStockBatch, shipmentBatch]);
    expect(allocation).toBe(inStockBatch.id);
  });
});

describe('out of stock exception', () => {
  test('test raises out of stock exception if cannot allocate', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 10, 10);
    allocate(line, [batch])
    const secondLine = new OrderLine(1, 'LAMP', 1)
    Object.freeze(secondLine)
    expect(allocate(secondLine, [batch])).toBe('out of stock')
  })

})
