import { tearDownMikroOrm } from "../../../repository/mikroOrm/config/setupOrm";
import { createUowTest } from "../createUowTest";
import { MikroOrmUow } from "./uow.mikroOrm";

createUowTest(
  'mikroOrm unit of work test',
  MikroOrmUow,
  tearDownMikroOrm
)
