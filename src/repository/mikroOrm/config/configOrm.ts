import config from '../../../config';
import { BatchEntity } from '../BatchEntity';
import { OrderLineEntity } from '../OrderLineEntity';
import { ProductEntity } from '../ProductEntity';

export default {
  entities: [ProductEntity, BatchEntity, OrderLineEntity],
  dbName: config.POSTGRES_DB_NAME,
  user: config.POSTGRES_USER_NAME,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
  type: 'postgresql' as 'postgresql',
};
