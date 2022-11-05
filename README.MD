# Project Title

Domain-driven design practice with Order System server

## Purpose

해당 프로젝트는 도메인 주도 개발(DDD)을 적용해보기 위한 프로젝트다. 여러가지 주제의 프로젝트에서 DDD를 도입하려 해보았지만, 대부분의 프로젝트가 도메인 모델을 정의 하기에는 지나치게 Data 의존적이였다. Order System을 구현해보며 DDD를 적용해보고, entity, aggregate, 값 객체, onion architecture, 클린 아키텍쳐 등의 개념을 실현해보고자 한다. 해당 프로젝트는 'Architecture patterns with Python'의 주문 시스템 예제를 활용했다.

이 프로젝트의 주안점은 세가지이다.
1. 현실세계의 비즈니스를 어떻게 비즈니스 모델로 표현할 것인가
2. 비즈니스 모델을 변경할 때, 다른 인프라에 영향을 받지 않고 쉽게 변경가능하려면, 어떻게 관심사를 분리할 것인가?
3. TDD의 도입을 통해, 불필요한 코드의 작성을 방지하고, 코드의 변경 때문에 테스트를 통과하지 못하는 상황을 피해, 리팩토링과 새로운 기능을 추가할 수 있게 만들어주려면 어떻게 해야할 것인가?

## Domain 정의

product는 sku를 식별자로 가진다. sku는 stock keeping unit의 약자이다. customer는 order를 넣는다. order는 order reference에 의해 식별되며, 한 줄 이상의 order line을 포함한다. 각 주문 라인에는 sku와 quantity가 있다.(예를들어 line은 'RED-CHAIR' 10단위, 'TASTELESS-LAMP' 1단위 처럼 이루어진다.)

구매부서는 재고를 작은 batch로 주문한다. 재고 batch는 id, sku, quantity로 이루어 진다.

batch에 line을 할당해야한다. line을 batch에 할당하면 해당 배치에 속하는 재고를 고객의 주소로 배송한다. 어떤 배치의 재고를 주문 라인에 x단위로 할당하면 availableQuantity는 x만큼 줄어든다.

- 20 단위의 SMALL-TABLE로 이루어진 batch가 있고, 2단위의 SMALL-TABLE을 요구하는 line이 있다. line을 batch에 할당하면, batch에는 18단위의 availableQuantity가 남는다.

- 1단위의 BLUE-CUSHION이라는 batch에는 2단위의 BLUE-CUSHION line을 할당해서는 안된다.

- 10단위의 BLUE-VASE라는 batch가 있고, 2단위의 BLUE-VASE line을 배치에 할당한다. 같은 line을 같은 batch에 할당해도 배치의 가용재고 수량은 계속 8개를 유지해야한다.

- batch가 현재 배송 받는중이라면, ETA 정보가 배치에 들어있다. ETA가 없는 배치는 창고 재고이다. 창고 재고를 배송 받는중인 배치보다 먼저 할당해야한다. 배송중인 배치를 할당할 때는, ETA가 빠른 배치를 먼저 할당한다.

<!-- ## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system -->

<!-- ## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds -->

<!-- ## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us. -->

<!-- ## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).  -->

## Authors

* **Ohbin Kwon** - [gitHub](https://github.com/ohbin-kwon)

## License

This project is licensed under the MIT License