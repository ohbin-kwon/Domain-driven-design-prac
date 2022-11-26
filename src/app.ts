import express from "express";
import { setupMikroOrmRepo } from "./repository/mikroOrm/config/setupRepo";
import { service } from "./service/service";
import config from "./config"

const app = express()

app.use(express.json())

app.post('/batch', async(req, res) => {
  const {id, sku, qty, eta} = req.body
  const repo = await setupMikroOrmRepo(config.NODE_ENV)
  try{
    await service().addBatch(repo, id, sku, qty, eta)
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
  
  const repo = await setupMikroOrmRepo(config.NODE_ENV)
  try{
    const batchId = await service().allocate(repo, orderId, sku, qty)
    res.status(201).send({batchId})
  }catch(error){
    let message;
    if(error instanceof Error) message = error.message
    else message = String(error)
    res.status(400).send({message})
  }
})

export default app