import express from "express";
import { setupMikroOrmRepo } from "./repository/mikroOrm/config/setupRepo";
import { service } from "./service/service";
import config from "./config"

const app = express()

app.use(express.json())

app.post('/allocate', async (req, res) => {
  const {orderId, sku, qty} = req.body
  
  const repo = await setupMikroOrmRepo(config.NODE_ENV)
  try{
    const batchId = await service().allocate(orderId, sku, qty, repo)
    res.status(201).send({batchId})
  }catch(error){
    let message;
    if(error instanceof Error) message = error.message
    else message = String(error)
    res.status(400).send({message})
  }
})

export default app