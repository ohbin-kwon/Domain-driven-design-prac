import app from './app';
import request from 'supertest';
import { createE2EData } from './createE2EData';
import { Batch } from './domain/batch';
import { v4 } from 'uuid';
import { configMikroOrm } from './repository/mikroOrm/config/configE2E';

export const uuid = () => {
  const tokens = v4().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

describe('e2e senario: production orm is mikroOrm', () => {
  it('test correct path returns 201 and allocated batch', async () => {
    const earlyBatchId = uuid();
    const laterBatchId = uuid();
    const otherBatchId = uuid();
    const sku = uuid();
    const otherSku = uuid();
    const orderId = uuid();

    const EARLY_BATCH = new Batch(
      earlyBatchId,
      sku,
      100,
      new Date('2022-08-11'),
    );
    const LATER_BATCH = new Batch(
      laterBatchId,
      sku,
      100,
      new Date('2022-08-13'),
    );
    const OTHER_BATCH = new Batch(otherBatchId, otherSku, 100);

    await createE2EData(configMikroOrm, [
      EARLY_BATCH,
      LATER_BATCH,
      OTHER_BATCH,
    ]);

    const data = { orderId, sku, qty: 3 };
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
