import express from 'express'
import { inspect } from 'util'
const router = express.Router();

import config from '../config/config.json'
import Order from '../model/order'
import History from '../model/history'
import { HOWTO_MESSAGE } from './index'
import { Line } from '../adapter/line.js'

const USED_GROUP = config.line.groupId

/**
 * 
 * @param {*} to 
 * @return Promise<any>
 * @description Show order summary from id of day's order and reply line group by replyToken
 */
const showSummary = (to) => {
  return new Promise(async(resolve,reject)=>{
    if(to){
      const results = await Order.find({}).exec().catch(err=>reject(err))
      let msg = ""
      if(results.length > 0){

        const summaryMessage = []

        for(let [index,order] of results.entries()){

          const orderName = order.orderName
          const name = order.name
          const counter = (index+1) +") "

          summaryMessage.push(counter,  orderName, " -> [", name, "]\n")
        }

        if(summaryMessage.length>0){
          summaryMessage.splice(0, summaryMessage.length - 1)
        }
        msg = summaryMessage.join('')
      }else {
        msg = "ยังไม่มีใครสั่งออเดอร์จ้า"
      }

      await Line.sendMessage(USED_GROUP, msg)

      resolve(results)
    }
  })  
}

const findOrderAll = () => {
  return Order.find({}).exec()
}


router.post("/",(req,res)=>{
  console.log(req.body)
  res.status(200)
  res.json({success:true,data:req.body})
})



router.post("/send/message",async (req,res)=>{
  const reqMessage = req.body.message

  await Line.sendMessage(USED_GROUP, reqMessage)

  res.status(200)
  res.json({success:true})  
})

router.get("/listorder",async(req,res)=>{
  const orders = await findOrderAll().catch(err=>console.log(err))
  if(orders){
    console.log(orders)
    res.status(200)
    res.send({orders})
  }else{
    res.status(200).send({orders:[]})
  }
})

router.get("/summary",async(req,res)=>{
  const sum = await showSummary(USED_GROUP)
  res.send({success:true,data:sum})
})


router.get("/howto",async(req,res)=>{
  await Line.sendMessage(USED_GROUP, HOWTO_MESSAGE)
  res.send({success:true,msg:HOWTO_MESSAGE})
})

router.post("/start/order",(req,res)=>{

})

router.post("/end/order",(req,res)=>{
  
})

router.get("/history/orders",(req,res)=>{
  const currentDate = new Date(Date.now())
  const date = currentDate.getDate()
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  const start = new Date(year,month,date,0,0,0)
  const end = new Date(year,month,date,23,59,59)

  const query = {
    timestamp: {
      $gte: start,
      $lte: end
    }
  }
  History.find(query).exec()
    .then(results=>{
      console.log("results:", results)
      return results
    })
    .then((results)=>{
      res.status(200).send({success:true,data:results})
    })
})

//\uDBC0\uDC50
const sendListWithPrice = async (resultList) => {
  let priceAccumulator = 0
  let counter = 1
  const msgList = resultList.map(order => {
    const price = order.price
    priceAccumulator += parseInt(price)
    return `${counter++}) ${order.orderName} -> [${order.name}] = ${price}฿ `
  })

  let msg = msgList.join("\n")
  msg = msg + `\n\uDBC0\uDCB4 total: ${priceAccumulator}฿`

  await Line.sendMessage(USED_GROUP, msg)
}

router.post("/addprice",async (req,res,next)=>{
  // const {prices} = req.body
  // const order = await findOrderAll()
  // if(order){
  //   const msgList = this.state.orders.map(order=>{
  //     const price = prices[order._id]
  //     priceAccumulator += parseInt(price)
  //     return `${counter++}) ${order.orderName} -> [${order.name}] \uDBC0\uDC50${price}฿ `
  //   })
  // }

  console.log("req.body")
  console.log(inspect(req.body,{colors:true,depth:Infinity}))
  const {orders,id} = req.body.data

  History.findOne({_id:id})
    .exec()
    .then(result=>{
      if(result){
        result.orders = orders
        return result
      }else{
        return Promise.reject("Historical order not found!")
      }
    })
    .then(result=> {
      console.log("result then2: ",result)
      result.save()
        .then(saveResult=>{
          console.log("saveResult: ",saveResult)
          sendListWithPrice(result.orders)
          res.status(200).send({success:true})
        })
        .catch(err=>next({message:"Cannot save new data:" + err}))
    })
    .catch(err=>next({message:err}))

})

export default router