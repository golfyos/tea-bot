import express from 'express';
import axios from 'axios'
import {usedGroup,channelAccessToken} from '../config/config'
const router = express.Router();
import localStorage from 'localStorage'

import {responseData,makeTextMessageObj,makeStickerMessageObj} from '../util/data_util'
import Order from '../model/order'
import User from '../model/user'
import History from '../model/history'
import services from './controller'
import adminController from './admin'

const CALL_GET_ALL_MEMBER = groupId => `https://api.line.me/v2/bot/group/${groupId}/members/ids`
const TYPE_MESSAGE = "message"
const MESSAGE_START_ORDER = "start order"
const MESSAGE_START_ORDER_FOOD = "start order ร้านลุงไหว"
const MESSAGE_START_ORDER_SEVEN = "start order 7-11"
const MESSAGE_END_ORDER = "end order"
const CALL_REPLY_MESSAGE = "https://api.line.me/v2/bot/message/reply"
const CALL_GROUP_MEMBER_GET_PROFILE = (groupId,userId)=> `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`
const CALL_SEND_MESSAGE = "https://api.line.me/v2/bot/message/push"
const CALL_OAUTH_LINE = "https://api.line.me/v2/oauth/accessToken"
const TYPE_MESSAGE_TEXT = "text"
const HEADER = {
  headers : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + channelAccessToken
  }
}
const USED_GROUP = usedGroup
const ORDERED_FORMAT = "How To Order: \n\"สั่ง-<Your Order>-<Your Name>\"\nExample: \nสั่ง-ชานมไข่มุก หวาน900%-ไก่\n"
const LINESPACE = "======================\n"
const EDIT_FORMAT = "How To Edit: \n\"แก้ - <old order> : <new order> - <name>\"\nExample: \nแก้-กระเพาหมูสับ:ข้าวผัดต้มยำไก่-ไก่\n"

const DELETE_FORMAT = "How To Delete: \n\"ลบ - <Your order> - <name>\"\n"

const COMMAND_WORDS = [MESSAGE_START_ORDER,MESSAGE_END_ORDER]
const ADMIN_GOLF_ID = "Ud4176bdaea15ecbd5ef5841d2484f815"
const ADMIN_PJOM_ID = "U0695ecbf766079f40dc52f5ce62ec8a1"
const ADMIN_PYO_ID = "Ubb429e18e52f145b20fe70f0227062ea";
/* golf p'jom jah pyo */
const ADMIN_IDs = ["Ud4176bdaea15ecbd5ef5841d2484f815","U0695ecbf766079f40dc52f5ce62ec8a1","Ub2080c10bf84a1ef1915e74ef251e14e","Ubb429e18e52f145b20fe70f0227062ea"]
const MESSAGE_GREETING_START_ORDER = "=================\n=======เริ่มสั่งได้=======\n================="
const MESSAGE_GREETING_END_ORDER = "=================\n====ปิดรับออเดอร์====\n================="
const BOT_STATUS_VERSION = "Bot Version: 2.0.8\n"
const MESSAGE_ORDER_WORD = "สั่ง"
const MESSAGE_EDIT_ORDER = "แก้"
const MESSAGE_DELETE_ORDER = "ลบ"
const MESSAGE_SUMMARY = "สรุป"
const MESSAGE_PAY_IMAGE = "pay-yo"
const JOM_PROMPT_PAY_IMAGE = "https://promptpay.io/0886253600/"
const PYO_PROMPT_PAY = "https://promptpay.io/1102001023038"


export const HOWTO_MESSAGE = BOT_STATUS_VERSION+LINESPACE+ORDERED_FORMAT+LINESPACE+EDIT_FORMAT+LINESPACE+DELETE_FORMAT+LINESPACE

const getAccessToken = async () =>{
  let config = {
    HEADER: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    body : {
      "grant_type" : "client_credentials",
      "client_id" : process.env.CLIENT_ID,
      "client_secret" : process.env.CLIENT_SECRET
    }
  }

  const formData = querystring.stringify(config.body)
  const content_length = formData.length

  config.HEADER.headers["Content-Length"] = content_length


  const token = await axios.post(CALL_OAUTH_LINE,formData,config.HEADER).catch(err=>console.log(err))
  return token.data.access_token
}

/* GET index page. */


router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express'
  });
});

router.use("/services",services)
router.use('/api/v1',adminController)

router.post("/auth/token",(req,res)=>{
  const {clientId,clientSecret} = req.body
  axios.post(CALL_OAUTH_LINE,{},{}).catch(err=>next(err))
})

router.get('/send/message',(req,res)=>{
  const sendUrl = "https://api.line.me/v2/bot/message/push"
  const messageObj = makeTextMessageObj("test message")
  const data = {
    "to" : USED_GROUP,
    "messages" : [messageObj]
  }

  const header = {
    headers : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + channelAccessToken
    }
  }
  axios.post(sendUrl,data,header)
    .then(result=>{
      console.log("Result :" , result)
    })
    .catch(err=> console.log(err))
    
    res.send({status:"Send Message Successfully"})
  
    
})  


router.get('/get/profile',(req,res)=>{
  axios.get(CALL_GROUP_MEMBER_GET_PROFILE(USED_GROUP,ADMIN_GOLF_ID),HEADER)
    .then(results=>{
      console.log(results.data)
    })
    .catch(err=>console.log(err))
  
  res.status(200)
  res.send({})
})




router.post("/webhook/callback",async (req,res,next)=>{

  const {type,source:{userId},message,replyToken,timestamp} = req.body.events[0]
  console.log(message, " : ",userId)

  /* Check is start or end order */
  let isCanOrder = localStorage.getItem('isCanOrder') == "true"
  if(type==TYPE_MESSAGE && message.type==TYPE_MESSAGE_TEXT){
    
    let msgInput = message.text.toLowerCase()
    if(msgInput.substring(0,msgInput.lastIndexOf("order")+"order".length)==MESSAGE_START_ORDER && ADMIN_IDs.includes(userId)){
      
      if(!isCanOrder){
        // timestamp
        localStorage.setItem('isCanOrder',true)
        let orderRestaurant = ""
        if(msgInput == MESSAGE_START_ORDER_FOOD){
          orderRestaurant = "ร้านลุงไหว"
        }else if(msgInput == MESSAGE_START_ORDER_SEVEN){
          orderRestaurant = "เซเว่น"
        }else{
          orderRestaurant = msgInput.substring("start order".length+1)
        }
        localStorage.setItem('order',orderRestaurant)
        /* response format to order */
        // makeStickerMessageObj(517,2),
        const messageObj = [
          makeStickerMessageObj(519,2),
          makeTextMessageObj(MESSAGE_GREETING_START_ORDER),
          makeTextMessageObj(HOWTO_MESSAGE),
        ]
        const bodyData = {
          "replyToken" : replyToken,
          "messages" : messageObj
        }
        axios.post(CALL_REPLY_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
        // localStorage.setItem("id",result._id)
      }
      responseData(res)
      return ;
    }
    /**
     * Check is End Order Command , Display Summary of orders , Record order of each user to database for Data Analytic
     * 
     */
    else if(msgInput == MESSAGE_END_ORDER && ADMIN_IDs.includes(userId)){
      if(isCanOrder){
        /* reply order is ended message and show summary */
        localStorage.setItem('isCanOrder',false)
        const orderRestaurant = localStorage.getItem("order")
        localStorage.removeItem("order")
        const resultData = await showSummary(replyToken)
        const resultProduction = await showSummaryProduction(USED_GROUP)

        const recordData = new History({
          order: orderRestaurant,
          timestamp: new Date(),
          orderer: userId,
          orders:resultData
        })
        await recordData.save().catch(err=>console.log(err))
        
        for(let order of resultData){
          await User.findOne({userId:order.userId},async (err,result)=>{
            if(err){
              console.log(err)
            }
            if(result != null){
              result.orders.push(order.orderName)
              await result.save().catch(err=>console.log(err))
            }else{
              const userProfile = await axios.get(CALL_GROUP_MEMBER_GET_PROFILE(USED_GROUP,order.userId),HEADER)
              const displayNameData = userProfile.data.displayName
              
              const newUser = new User({
                userId : order.userId,
                displayName: displayNameData,
                name: order.name,
                orders:[order.orderName]
              })

              await newUser.save().catch(err=>console.log(err))
            }
          })
        }

        await Order.deleteMany({}).catch(err=>console.log(err))

        const responseBody = {
          to : USED_GROUP,
          messages : [makeTextMessageObj(MESSAGE_GREETING_END_ORDER)]
        }
        await axios.post(CALL_SEND_MESSAGE,responseBody,HEADER).catch(err=>console.log(err))
      }
      responseData(res)
      return ;

    }
    
    /**
     * Display Order Summary by Admin only
     */
    else if(msgInput == MESSAGE_SUMMARY && ADMIN_IDs.includes(userId) && isCanOrder){
      /* Get Current Order */
      showSummary(replyToken)
    }

    else if(msgInput.includes("pay-") && ADMIN_IDs.includes(userId)){
      let cost = msgInput.split("-")
      
      if(cost.length>1){
        cost[1] = cost[1].trim()

        let bodyData = {}
        let imgData = {}

        if(cost[1]=="yo"){
          imgData = {
            "type":"image",
            "originalContentUrl" : PYO_PROMPT_PAY,
            "previewImageUrl" : PYO_PROMPT_PAY
          }
          bodyData = {
            to : USED_GROUP,
            messages: [imgData]
          }
        }else if(cost[1]=="jom"){
          imgData = {
            "type":"image",
            "originalContentUrl" : JOM_PROMPT_PAY_IMAGE,
            "previewImageUrl" : JOM_PROMPT_PAY_IMAGE
          }
          bodyData = {
            to : USED_GROUP,
            messages: [imgData]
          }
        }

        await axios.post(CALL_SEND_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
      }
    }
    
    else{

      if(isCanOrder){
        // keep order to database
        // response each order
        
        const messageObj = []
        
        let action = message.text.split("-")
        
        if(action.length == 3){
          let [command,order,name] = action
          order = order.trim()
          name = name.trim()
          command = command.trim()
          if(command == MESSAGE_ORDER_WORD){
            console.log("Ordered")
            
            const orderSchema = new Order({
              userId,
              timestamp,
              orderName:order,
              name
            })

            orderSchema.save().catch(err=>console.log(err))

            messageObj.push(makeTextMessageObj("Recorded"))
            const bodyData = {
              "replyToken" : replyToken,
              "messages" : messageObj
            }
            await axios.post(CALL_REPLY_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
            
          }
          /**
           * Edit Order
           */
          else if(command == MESSAGE_EDIT_ORDER){
            // TODO Code
            const chooseOrder = order.split(":")
            const oldOrder = chooseOrder[0].trim()
            const newOrder = chooseOrder[1].trim()

            let bodyData = {}
            console.log(newOrder)
            if(newOrder == undefined){
              messageObj.push(makeTextMessageObj("Wrong Format! ต้องเป็น\nแก้ - <oldOrder>:<newOrder> - ชื่อ"))
              bodyData = {
                "replyToken" : replyToken,
                "messages" : messageObj
              }
            }else{

              await Order.findOne({orderName:oldOrder,userId:userId,name:name},async (err,oldOrderResult)=>{
                if(oldOrderResult == undefined){
                  messageObj.push(makeTextMessageObj("Warning:ไม่สามารถแก้ไขแทนกันได้น้ะจ้ะ\nYour Old order Not Found!\nโปรดระบุอออเดอร์เก่าให้ถูกต้อง"))
                  bodyData = {
                    "replyToken" : replyToken,
                    "messages" : messageObj
                  }
                }else{
                  messageObj.push(makeTextMessageObj("Edited: "+oldOrder + " --> " + newOrder))
                  bodyData = {
                    "replyToken" : replyToken,
                    "messages" : messageObj
                  }
                  oldOrderResult.orderName = newOrder
                  await oldOrderResult.save().catch(err=>console.log(err))
                }
              })
            }
            await axios.post(CALL_REPLY_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
          }

          else if(command == MESSAGE_DELETE_ORDER){

            await Order.findOne({userId:userId,orderName:order,name:name},async(err,result)=>{
              if(result!=null){
                console.log("Deleted: ",result)
                Order.deleteOne({userId:userId,orderName:order,name:name},async(err,result2)=>{
                  if(err){
                    console.log(err)
                  }
                  messageObj.push(makeTextMessageObj("Deleted: "+ order))
                  const bodyData = {
                    "replyToken" : replyToken,
                    "messages" : messageObj
                  }
                  await axios.post(CALL_REPLY_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
                })

              }else{
                messageObj.push(makeTextMessageObj("Warning:ไม่สามารถลบแทนกันได้น้ะจ้ะ\nYour order Not Found!\nPlease type your ordered to delete"))
                const bodyData = {
                  "replyToken" : replyToken,
                  "messages" : messageObj
                }
                await axios.post(CALL_REPLY_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
              }
            })
          }

       }
       /* Not Record , Just a chat not order */
       else{
         
       }

        if(msgInput=="?help"){
          const bodyDataHowTo = {
            "replyToken" : replyToken,
            "messages" : [makeTextMessageObj(HOWTO_MESSAGE)]
          }
          await axios.post(CALL_REPLY_MESSAGE,bodyDataHowTo,HEADER).catch(err=>console.log(err))
        }
        
      }else{

      }
      // console.log(req.body.events)
    }
  }
  

  responseData(res)
})

/**
 * 
 * @param {*} replyToken 
 * @return Promise<any>
 * @description Show order summary from id of day's order and reply line group by replyToken
 */
const showSummary = (replyToken) => {
  return new Promise((resolve,reject)=>{
    if(replyToken != undefined){
      Order.find({},async (err,results)=>{
        console.log("results all: ",results)
        if(err){
          reject(err)
        }
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
          await axios.post(CALL_REPLY_MESSAGE,{replyToken:replyToken,messages:[makeTextMessageObj(summaryString)]},HEADER).catch(err=>console.log(err))
          resolve(results)
        }else{
          await axios.post(CALL_REPLY_MESSAGE,{replyToken:replyToken,messages:[makeTextMessageObj("ยังไม่มีใครสั่งออเดอร์จ้า")]},HEADER).catch(err=>console.log(err))
          resolve(results)
        }
      })
    }
  })  
}

/**
 * 
 * @param {*} replyToken 
 * @return Promise<any>
 * @description Show order summary of that day without name
 */
const showSummaryProduction = (to)=>{
  return new Promise((resolve,reject)=>{
    if(to != undefined){
      Order.find({},async (err,results)=>{
        console.log("results all: ",results)
        if(err){
          reject(err)
        }
        if(results.length > 0){
          let summaryString = ""
          for(let [index,order] of results.entries()){
            const orderName = order.orderName
            const counter = (index+1) +") "
            summaryString = summaryString + counter + orderName + "\n"
          }
          if(summaryString.length>0){
            summaryString = summaryString.substring(0,summaryString.length-1)
          }
          await axios.post(CALL_SEND_MESSAGE,{to:to,messages:[makeTextMessageObj(summaryString)]},HEADER).catch(err=>console.log(err))
          resolve(results)
        }else{
          await axios.post(CALL_SEND_MESSAGE,{to:to,messages:[makeTextMessageObj("ยังไม่มีใครสั่งออเดอร์จ้า")]},HEADER).catch(err=>console.log(err))
          resolve(results)
        }
      })
    }
  })  
}

const generatePDF = (data) => {

}

router.all("*",(req,res,next)=>{
  res.setTimeout(1)
  res.redirect("/")
})

export default router;
