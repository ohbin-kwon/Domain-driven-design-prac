import { Batch } from "../../domain/batch";
import { createRepoTest } from "../createRepoTest";
import { FakeRepository } from "./repository";

let init: Batch[] = []

createRepoTest('fakeRepoTest',
  async () => {
    return FakeRepository(init)
  },
  async () => {
    init.splice(0, init.length)
  }
)