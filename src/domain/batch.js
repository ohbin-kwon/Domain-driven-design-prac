// OrderLine 클래스로 생성된 객체는 식별자가 없다.
// 데이터는 있지만, 식별자가 없는 비즈니스 개념을 값객체라고 표현한다.
// 즉, 객체안의 데이터에 따라 식별될수있는 도메인 객체를 의미한다.
// 예를 들어, 우리가 1000원을 말할때, 1000원의 가치가 중요하지, 1000원의 지폐가 어떤것인지는 중요하지 않은 것과 같은 의미이다.
// 따라서, 객체안의 데이터가 바뀌면 더 이상 의미가 없어지는게 값객체이다.
// 그래서 값객체는 불변객체로서 사용해야한다.
// js에서 불변객체를 만들기위해서는 1. 컨벤션을 가지고 필요한 부분에 불변객체를 사용하거나 2. 인간을 믿지 못한다면 라이브러리를 활용해 강제해야한다.
// 1번을 채택하고, OrderLIne으로 객체를 생성할때는 불변객체로 생성한다.
export class OrderLine {
  constructor(orderId, sku, quantity) { // orderId는 Order의 식별자이지, OrderLine의 식별자가 아니다.
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