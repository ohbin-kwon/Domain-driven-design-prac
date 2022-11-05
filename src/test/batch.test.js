import {Batch, OrderLine} from "../domain/batch"

test('test allocating to a batch reduces the available quantity', () => {
  const batch = new Batch("batch-001", "SMALL-TABLE", 20, Date.now())
  const line = new OrderLine('order-ref', "SMALL-TABLE", 2)

  batch.allocate(line)

  expect(batch.availableQuantity).toBe(18)
});