import app from '../app';
import request from 'supertest';
import { v4 } from 'uuid';

const uuid = () => {
  const tokens = v4().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

const addBatch = async (batchId: string, sku: string, quantity: number, eta?: Date) => {
  await request(app).post('/batch').send({ batchId, sku, quantity, eta }).expect(201);
};

describe('e2e senario: production orm is mikroOrm', () => {
  it('test correct path returns 201 and allocated batch', async () => {
    const earlyBatchId = uuid();
    const laterBatchId = uuid();
    const otherBatchId = uuid();
    const sku = uuid();
    const otherSku = uuid();
    const orderId = uuid();

    await addBatch(earlyBatchId, sku, 100, new Date('2022-08-11'));
    await addBatch(laterBatchId, sku, 100, new Date('2022-08-13'));
    await addBatch(otherBatchId, otherSku, 100);

    const data = { orderId, sku, quantity: 3 };
    await request(app)
      .post('/allocate')
      .send(data)
      .expect(201, { batchId: earlyBatchId });
  });

  it('test wrong path returns 400 and error message', async () => {
    const orderId = uuid();
    const unknownSku = uuid();

    const data = { orderId, sku: unknownSku, qty: 3 };
    await request(app)
      .post('/allocate')
      .send(data)
      .expect(400, { message: `invalid sku - ${unknownSku}` });
  });
});
