import { Batch, OrderLine, allocate } from '../domain/batch';
// batchQuantity, lineQuantity에 맞는 batch와 line을 만들어내는 함수
function makeBatchAndLine(sku, batchQuantity, lineQuantity) {
  return [
    new Batch('batch-001', sku, batchQuantity, Date.now()),
    Object.freeze(new OrderLine('order-123', sku, lineQuantity)),
  ];
}
describe('allocate test', () => {
  // required보다 available이 많은 경우 할당할 수 있다.
  test('test can allocate if available greater than required', () => {
    const [largeBatch, smallLine] = makeBatchAndLine('LAMP', 20, 2);
    expect(largeBatch.canAllocate(smallLine)).toBe('SUCCESS');
  });
  // required보다 available이 적은 경우 할당할 수 없다.
  test('test cannot allocate if available smaller than required', () => {
    const [smallBatch, largeLine] = makeBatchAndLine('LAMP', 2, 20);
    expect(smallBatch.canAllocate(largeLine)).toBe('OUT-OF-STOCK');
  });

  // required와 available이 같다면 할당 할 수 있다.
  test('test can allocate if available equal to required', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 2, 2);
    expect(batch.canAllocate(line)).toBe('SUCCESS');
  });

  // batch와 line의 sku가 다르다면 할당 할 수 없다.
  test('test cannot allocate if batch sku and line sku do not match', () => {
    const batch = new Batch('batch-001', 'LAMP', 100, Date.now());
    const differentSkuLine = new OrderLine('order-123', 'CHAIR', 10);
    Object.freeze(differentSkuLine);
    expect(batch.canAllocate(differentSkuLine)).toBe('DIFFERENT-SKU');
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
    const unallocatedLine = new OrderLine('order-123', 'SMALL-TABLE', 3);
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
    const inStockBatch = new Batch('in-stock-batch', 'CLOCK', 100, null);
    const shipmentBatch = new Batch('shipment-batch', 'CLOCK', 100, 1667650163403);
    const line = new OrderLine('order-123', 'CLOCK', 10);

    allocate(line, [inStockBatch, shipmentBatch]);

    expect(inStockBatch.availableQuantity).toBe(90);
    expect(shipmentBatch.availableQuantity).toBe(100);
  });

  test('test prefers earlier batches', () => {
    const earliest = new Batch('earliest-batch', 'CLOCK', 100, 1667650163403);
    const medium = new Batch('medium-batch', 'CLOCK', 100, 1667650163404);
    const latest = new Batch('latest-batch', 'CLOCK', 100, 1667650163405);
    const line = new OrderLine('order-123', 'CLOCK', 10);

    allocate(line, [earliest, medium, latest])

    expect(earliest.availableQuantity).toBe(90)
    expect(medium.availableQuantity).toBe(100)
    expect(latest.availableQuantity).toBe(100)
  })

  test('test returns allocated batch ref', () => {
    const inStockBatch = new Batch('in-stock-batch', 'CLOCK', 100, null);
    const shipmentBatch = new Batch('shipment-batch', 'CLOCK', 100, 1667650163403);
    const line = new OrderLine('order-123', 'CLOCK', 10);

    const allocation = allocate(line, [inStockBatch, shipmentBatch]);
    expect(allocation).toBe(inStockBatch.reference)
  })
});

describe('out of stock exception', () => {
  test('test raises out of stock exception if cannot allocate', () => {
    const [batch, line] = makeBatchAndLine('LAMP', 10, 10);
    allocate(line, [batch])
    const secondLine = new OrderLine('order-123', 'LAMP', 1)
    Object.freeze(secondLine)
    expect(allocate(secondLine, [batch])).toBe('OUT-OF-STOCK')
  })

})
