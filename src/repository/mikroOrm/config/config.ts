import { BatchEntity } from '../BatchEntity';
import { OrderLineEntity } from '../OrderLineEntity';
import { ENV_PATH } from '../../../../const';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.join(__dirname, ENV_PATH),
});

export default {
  entities: [BatchEntity, OrderLineEntity],
  dbName: process.env.POSTGRES_DB_NAME,
  type: 'postgresql',
  user: process.env.POSTGRES_USER_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
};
