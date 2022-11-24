import express from "express";
import { OrderLine } from "./domain/batch";
import { configMikroOrm } from "./repository/mikroOrm/config/configE2E";
import { service } from "./service/service";

const app = express()

app.use(express.json())



app.post('/allocate', async (req, res) => {
  const {orderId, sku, qty} = req.body

  const repo = await configMikroOrm()
  const line = new OrderLine(orderId, sku, qty)
  try{
    const batchId = await service().allocate(line, repo)
    res.status(201).send({batchId})
  }catch(error){
    let message;
    if(error instanceof Error) message = error.message
    else message = String(error)
    res.status(400).send({message})
  }
})

export default app