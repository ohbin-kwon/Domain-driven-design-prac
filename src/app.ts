import express from "express";
import { service } from "./service/service";
import { MikroOrmUow } from "./service/uow/mikroOrm/uow.mikroOrm";

const app = express()

app.use(express.json())

app.post('/batch', async(req, res) => {
  const {id, sku, qty, eta} = req.body
  try{
    const uow = await MikroOrmUow()
    await service().addBatch(uow, id, sku, qty, eta)
    res.status(201).end()
  } catch(error) {
    let message;
    if(error instanceof Error) message = error.message
    else message = String(error)
    res.status(400).send({message})
  }
})

app.post('/allocate', async (req, res) => {
  const {orderId, sku, qty} = req.body
  
  try{
    const uow = await MikroOrmUow()
    const batchId = await service().allocate(uow , orderId, sku, qty)
    res.status(201).send({batchId})
  }catch(error){
    let message;
    if(error instanceof Error) message = error.message
    else message = String(error)
    res.status(400).send({message})
  }
})

export default app