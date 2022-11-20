import { createRepoTest } from '../createRepoTest';
import { setupMikroOrmRepo, tearDownMikroOrm } from './config/configTest';

createRepoTest(
  'MikroOrmTest',
  setupMikroOrmRepo,
  tearDownMikroOrm
);
