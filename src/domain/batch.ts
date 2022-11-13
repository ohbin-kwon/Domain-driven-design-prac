enum AllocateResult {
  'SUCCESS' = 'success',
  'OUT-OF-STOCK' = 'out of stock',
  'DIFFERENT-SKU' = 'sku is different',
}

interface Set<T> {
  add(value: T): this;
  clear(): void;
  delete(value: T): boolean;
  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: any,
  ): void;
  has(value: T): boolean;
  readonly size: number;
}

interface ExistedEtaBatch extends Batch {
  eta: Date;
}

function _catchInStockBatch(batches: Array<Batch>) {
  for (let batch of batches) {
    if (batch.eta === undefined) return batch;
  }
  return null;
}

function _findEarliestEtaBatch(batches: Array<ExistedEtaBatch>) {
  batches.sort((a, b) => {
    if (a.eta < b.eta) {
      return -1;
    }
    if (a.eta > b.eta) {
      return 1;
    }
    return 0;
  });
  return batches[0];
}

function _checkBatchesEta(batches: Array<Batch>) {
  const batch = _catchInStockBatch(batches);
  if (batch === null) {
    // issue #5 will explain about type assertion
    return _findEarliestEtaBatch(batches as Array<ExistedEtaBatch>);
  }
  return batch;
}

export class OrderLine {
  constructor(
    public orderId: number,
    public sku: string,
    public quantity: number,
  ) {
    // orderId는 Order의 식별자이지, OrderLine의 식별자가 아니다.
    this.orderId = orderId;
    this.sku = sku;
    this.quantity = quantity;
  }
}

export class Batch {
  constructor(
    public reference: string,
    public sku: string,
    quantity: number,
    public eta?: Date,
  ) {
    this.reference = reference;
    this.sku = sku;
    this.eta = eta;
    this._purchasedQuantity = quantity;
    this._allocation = new Set();
  }

  _purchasedQuantity: number;
  _allocation: Set<OrderLine>;

  canAllocate(line: OrderLine) {
    if (this.sku !== line.sku) return AllocateResult['DIFFERENT-SKU'];
    if (line.sku && this.availableQuantity < line.quantity)
      return AllocateResult['OUT-OF-STOCK'];
    return AllocateResult['SUCCESS'];
  }

  allocate(line: OrderLine) {
    const allocateResult = this.canAllocate(line);
    if (allocateResult !== AllocateResult['SUCCESS']) {
      return allocateResult;
    }
    this._allocation.add(line);
    return allocateResult;
  }
  deallocate(line: OrderLine) {
    if (this._allocation.has(line)) {
      this._allocation.delete(line);
    }
  }

  get allocatedQuantity() {
    let sum = 0;
    this._allocation.forEach((line) => (sum += line.quantity));
    return sum;
  }

  get availableQuantity() {
    return this._purchasedQuantity - this.allocatedQuantity;
  }
}

export function allocate(line: OrderLine, batches: Array<Batch>) {
  const batch = _checkBatchesEta(batches);
  const allocateResult = batch.allocate(line);
  if (allocateResult !== AllocateResult['SUCCESS']) {
    return allocateResult;
  }
  return batch.reference;
}
