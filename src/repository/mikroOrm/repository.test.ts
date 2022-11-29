import { createRepoTest } from '../createRepoTest';
import { setUpMikroOrmSession, tearDownMikroOrm } from './config/setupOrm';
import { MikroOrmRepository } from './repository';

createRepoTest(
  'MikroOrmTest',
  setUpMikroOrmSession,
  tearDownMikroOrm,
);
