import { createRepoTest } from '../createRepoTest';
import { setUpMikroOrmSession, tearDownMikroOrm } from './config/setupOrm';

createRepoTest('MikroOrmTest', setUpMikroOrmSession, tearDownMikroOrm);
