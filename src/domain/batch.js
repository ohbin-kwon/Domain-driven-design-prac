export class OrderLine {
  constructor(orderId, sku, quantity) {
    this.orderId = orderId
    this.sku = sku
    this.quantity = quantity
  }
}

export class Batch {
  constructor(reference, sku, quantity, eta) {
    this.reference = reference
    this.sku = sku
    this.eta = eta
    this.availableQuantity = quantity
  }

  allocate (line) {
    this.availableQuantity -= line.quantity
  }
}