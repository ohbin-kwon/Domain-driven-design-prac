import {
  connectMikroOrm,
  setUpMikroOrmSession,
  tearDownMikroOrm,
} from '../../../repository/mikroOrm/config/setupOrmTest';
import { createUowTest } from '../createUowTest';
import { MikroOrmUow } from './uow.mikroOrm';

createUowTest(
  'mikroOrm unit of work test',
  connectMikroOrm,
  setUpMikroOrmSession,
  MikroOrmUow,
  tearDownMikroOrm,
);
