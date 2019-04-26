import express from 'express'
const router = express.Router();
import axios from 'axios'
import {makeTextMessageObj} from '../util/data_util.js'
import {client_id,client_secret} from '../config/config'
import querystring from 'querystring'
import Order from '../model/order'
import History from '../model/history'
import {usedGroup} from '../config/config'
import {HOWTO_MESSAGE} from './index'
import {inspect} from 'util'
const USED_GROUP = usedGroup
const CALL_OAUTH_LINE = "https://api.line.me/v2/oauth/accessToken"
const CALL_SEND_MESSAGE = "https://api.line.me/v2/bot/message/push"


const getAccessToken = async () =>{
  let config = {
    HEADER: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    body : {
      "grant_type" : "client_credentials",
      "client_id" : client_id,
      "client_secret" : client_secret
    }
  }

  const formData = querystring.stringify(config.body)
  const content_length = formData.length

  config.HEADER.headers["Content-Length"] = content_length


  const token = await axios.post(CALL_OAUTH_LINE,formData,config.HEADER).catch(err=>console.log(err))
  return token.data.access_token
}


/**
 * 
 * @param {*} to 
 * @return Promise<any>
 * @description Show order summary from id of day's order and reply line group by replyToken
 */
const showSummary = (to) => {
  return new Promise(async(resolve,reject)=>{
    if(to != undefined){
      
      const results = await Order.find({}).exec().catch(err=>reject(err))
      let msg = ""
      if(results.length > 0){
        let summaryString = ""
        for(let [index,order] of results.entries()){
          const orderName = order.orderName
          const name = order.name
          const counter = (index+1) +") "
          summaryString = summaryString + counter + orderName + " -> [" + name + "]\n"
        }
        if(summaryString.length>0){
          summaryString = summaryString.substring(0,summaryString.length-1)
        }
        msg = [makeTextMessageObj(summaryString)]
      }else{
        msg = [makeTextMessageObj("ยังไม่มีใครสั่งออเดอร์จ้า")]
      }
      let bodyData = {
        "to" : to,
        "messages" : msg
      }

      const token = await getAccessToken()
      const HEADER = {
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : "Bearer " + token
        }
      }
      await axios.post(CALL_SEND_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
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



router.post("/send/message",async (req,res,next)=>{
  const token = await getAccessToken()
  const reqMessage = req.body.message
  const messages = [makeTextMessageObj(reqMessage)]
 
  const data = {
    "to" : USED_GROUP,
    "messages" : messages
  }

  const header = {
    headers : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + token
    }
  }
  const responseLine = await axios.post(CALL_SEND_MESSAGE,data,header).catch(err=>console.log(err))

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
  let bodyData = {
    "to" : USED_GROUP,
    "messages" : [makeTextMessageObj(HOWTO_MESSAGE)]
  }

  const token = await getAccessToken()
  const HEADER = {
    headers : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + token
    }
  }
  await axios.post(CALL_SEND_MESSAGE,bodyData,HEADER)
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

  const query = {timestamp: {$gte:start,$lte:end}}
  History.find(query).exec()
  .then(results=>{
    console.log("results:",results)
    return results
  })
  .then((results)=>{
    res.status(200).send({success:true,data:results})
  })
})

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
          res.status(200).send({success:true})
        })
        .catch(err=>next({message:"Cannot save new data:" + err}))
    })
    .catch(err=>next({message:err}))

})

export default router