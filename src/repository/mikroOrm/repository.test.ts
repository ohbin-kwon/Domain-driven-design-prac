import { createRepoTest } from '../createRepoTest';
import { setupMikroOrmRepo, tearDownMikroOrm } from './config/setupRepo';

createRepoTest(
  'MikroOrmTest',
  setupMikroOrmRepo,
  tearDownMikroOrm
);
