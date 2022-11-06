function _createEnum(values) {
  const enumObject = {};
  for (const val of values) {
    enumObject[val] = val;
  }
  return Object.freeze(enumObject);
}

const AllocateResult = _createEnum([
  'SUCCESS',
  'OUT-OF-STOCK',
  'DIFFERENT-SKU',
]);

function _compareBatchesEta(batches) {
  batches.forEach((batch) => {
    if (batch.eta === null) return batch;
  });
  function compare(a, b) {
    if (a.eta < b.eta) {
      return -1;
    }
    if (a.eta > b.eta) {
      return 1;
    }
    return 0;
  }
  batches.sort(compare);
  return batches[0];
}
export class OrderLine {
  constructor(orderId, sku, quantity) {
    // orderId는 Order의 식별자이지, OrderLine의 식별자가 아니다.
    this.orderId = orderId;
    this.sku = sku;
    this.quantity = quantity;
  }
}

export class Batch {
  constructor(reference, sku, quantity, eta) {
    this.reference = reference;
    this.sku = sku;
    this.eta = eta;
    this._purchasedQuantity = quantity;
    this._allocation = new Set();
  }

  canAllocate(line) {
    if (this.sku !== line.sku) return AllocateResult['DIFFERENT-SKU'];
    if (line.sku && this.availableQuantity < line.quantity)
      return AllocateResult['OUT-OF-STOCK'];
    return AllocateResult['SUCCESS'];
  }

  allocate(line) {
    const allocateResult = this.canAllocate(line);
    if (allocateResult !== AllocateResult['SUCCESS']) {
      return allocateResult;
    }
    this._allocation.add(line);
    return allocateResult;
  }
  deallocate(line) {
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

export function allocate(line, batches) {
  // batch의 eta가 null인곳에 우선적으로 배치한다.
  // batch의 eta가 작은곳부터 그다음 우선적으로 배치한다.
  // 배열의 item인 object의 property 비교를 통해 allocate 함수가 실행되기 때문에 해당 함수를 구현해서 allocate에 작성해야겠다.
  // 작성한 compareBatchesEta 함수를 이용한다.
  const batch = _compareBatchesEta(batches);
  const allocateResult = batch.allocate(line);
  if (allocateResult !== AllocateResult['SUCCESS']) {
    return allocateResult;
  }
  return batch.reference;
}
