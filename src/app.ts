import express from 'express';
import { service } from './service/service';
import { MikroOrmUow } from './service/uow/mikroOrm/uow.mikroOrm';
import {
  connectMikroOrm,
  setUpMikroOrmSession,
} from './repository/mikroOrm/config/setupOrm';
import { errorHandler } from './util/errorHandler';

const app = express();

app.use(express.json());

connectMikroOrm();

app.post('/batch', async (req, res, next) => {
  const { batchId, sku, quantity, eta } = req.body;
  try {
    const uow = await MikroOrmUow(setUpMikroOrmSession);
    await service().addBatch(uow, batchId, sku, quantity, eta);
    res.status(201).end();
  } catch (error) {
    next(error);
  }
});

app.post('/allocate', async (req, res, next) => {
  const { orderId, sku, quantity } = req.body;

  try {
    const uow = await MikroOrmUow(setUpMikroOrmSession);
    const batchId = await service().allocate(uow, orderId, sku, quantity);
    res.status(201).send({ batchId });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

export default app;
