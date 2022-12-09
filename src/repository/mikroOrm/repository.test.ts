import { createRepoTest } from '../createRepoTest';
import { connectMikroOrm, setUpMikroOrmSession, tearDownMikroOrm } from './config/setupOrmTest';

createRepoTest('MikroOrmTest',connectMikroOrm, setUpMikroOrmSession, tearDownMikroOrm);
