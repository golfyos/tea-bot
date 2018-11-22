import express from 'express';
import axios from 'axios'
import config from '../config/config'
const router = express.Router();
import localStorage from 'localStorage'
import {responseData,makeTextMessageObj,makeStickerMessageObj} from '../util/data_util'
import Order from '../model/order'
import User from '../model/user'
import History from '../model/history'

const CALL_GET_ALL_MEMBER = groupId => `https://api.line.me/v2/bot/group/${groupId}/members/ids`
const TYPE_MESSAGE = "message"
const MESSAGE_START_ORDER = "start order"
const MESSAGE_END_ORDER = "end order"
const CALL_REPLY_MESSAGE = "https://api.line.me/v2/bot/message/reply"
const CALL_GROUP_MEMBER_GET_PROFILE = (groupId,userId)=> `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`
const CALL_SEND_MESSAGE = "https://api.line.me/v2/bot/message/push"
const TYPE_MESSAGE_TEXT = "text"
const HEADER = {
  headers : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + config.channelAccessToken
  }
}
const ORDERED_FORMAT = "How To Order: \n\"สั่ง-<Your Order>-<Your Name>\"\nExample: \nสั่ง-ชานมไข่มุก หวาน900%-ไก่"
const COMMAND_WORDS = [MESSAGE_START_ORDER,MESSAGE_END_ORDER]
const ADMIN_GOLF_ID = "Ud4176bdaea15ecbd5ef5841d2484f815"
const ADMIN_PJOM_ID = "U0695ecbf766079f40dc52f5ce62ec8a1"
/* golf p'jom jah */
const ADMIN_IDs = ["Ud4176bdaea15ecbd5ef5841d2484f815","U0695ecbf766079f40dc52f5ce62ec8a1","Ub2080c10bf84a1ef1915e74ef251e14e"]
const MESSAGE_GREETING_START_ORDER = "=================\n====เริ่มสั่งชาไข่มุกได้====\n================="
const MESSAGE_GREETING_END_ORDER = "=================\n====ปิดรับออเดอร์====\n================="
const MESSAGE_ORDER_WORD = "สั่ง"
const MESSAGE_SUMMARY = "สรุป"
const MESSAGE_PAY_IMAGE = "pay-"
const JOM_PROMPT_PAY_IMAGE = "https://promptpay.io/0886253600/"

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/send/message',(req,res)=>{
  const sendUrl = "https://api.line.me/v2/bot/message/push"
  const messageObj = makeTextMessageObj("test message")
  const data = {
    "to" : config.testGroup,
    "messages" : [messageObj]
  }

  const header = {
    headers : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + config.channelAccessToken
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
  axios.get(CALL_GROUP_MEMBER_GET_PROFILE(config.testGroup,ADMIN_GOLF_ID),HEADER)
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
    if(msgInput==MESSAGE_START_ORDER && ADMIN_IDs.includes(userId)){
      if(!isCanOrder){
        // timestamp
        localStorage.setItem('isCanOrder',true)

        
        /* response format to order */
        // makeStickerMessageObj(517,2),
        const messageObj = [
          makeStickerMessageObj(519,2),
          makeTextMessageObj(MESSAGE_GREETING_START_ORDER),
          makeTextMessageObj(ORDERED_FORMAT),
        ]
        const bodyData = {
          "replyToken" : replyToken,
          "messages" : messageObj
        }
        axios.post(CALL_REPLY_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
      

        const order = new Order({
          datetime : Date.now()
        })
        order.save()
          .then(result=>{
            console.log(result)
            localStorage.setItem("id",result._id)
          })
          .catch(err=>console.log("Cannot Save"))
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
        const _id_ = localStorage.getItem('id')
        const resultData = await showSummary(_id_,replyToken)
        const orders = resultData.orders

        const recordData = new History({
          order: _id_,
          datetime: resultData.datetime,
          orderer: userId
        })
        await recordData.save().catch(err=>console.log(err))
        
        for(let order of orders){
          await User.findOne({userId:order.userId},async (err,result)=>{
            if(result != null){
              result.orders.push(order.order_info.orderName)
              await result.save().catch(err=>console.log(err))
            }else{
              const userProfile = await axios.get(CALL_GROUP_MEMBER_GET_PROFILE(config.milkTeaGroup,order.userId),HEADER)
              const displayNameData = userProfile.data.displayName
              
              const newUser = new User({
                userId : order.userId,
                displayName: displayNameData,
                name: order.name,
                orders:[order.order_info.orderName]
              })

              newUser.save().catch(err=>console.log(err))
            }
          })
        }

        const responseBody = {
          to : config.milkTeaGroup,
          messages : [makeTextMessageObj(MESSAGE_GREETING_END_ORDER)]
        }
        await axios.post(CALL_SEND_MESSAGE,responseBody,HEADER).catch(err=>console.log(err))
        localStorage.removeItem('id')
      }
      responseData(res)
      return ;

    }
    
    /**
     * Display Order Summary by Admin only
     */
    else if(msgInput == MESSAGE_SUMMARY && ADMIN_IDs.includes(userId)){
      /* Get Current Order */
      const _id_ = localStorage.getItem('id')
      showSummary(_id_,replyToken)
    }

    else if(msgInput.includes("pay-") && ADMIN_IDs.includes(userId)){
      let cost = msgInput.split("-")
      
      if(cost.length>1){
        cost[1] = cost[1].trim()
        const promptpayUrl = JOM_PROMPT_PAY_IMAGE+cost[1]
        const imgData = {
          "type":"image",
          "originalContentUrl" : promptpayUrl,
          "previewImageUrl" : promptpayUrl
        }
        console.log(promptpayUrl)
        const bodyData = {
          to : config.milkTeaGroup,
          messages: [imgData]
        }
        await axios.post(CALL_SEND_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
      }
    }
    
    else{

      if(isCanOrder){
        // keep order to database
        // response each order
        console.log("Ordered")

        const messageObj = [
          makeTextMessageObj("Recorded")
        ]

        let action = message.text.split("-")

        if(action.length == 3){
          let [command,order,name] = action
          order = order.trim()
          name = name.trim()
          // console.log(name)
          if(command.trim() == MESSAGE_ORDER_WORD){
            const recordId = localStorage.getItem("id")
            if(recordId != null){
              Order.findByIdAndUpdate(recordId,{
                $push: {
                  orders: {
                    userId : userId,
                    order_info:{
                      orderName: order,
                      timestamp:timestamp
                    },
                    name: name
                  }
                }
              },(err,results)=>{
                console.log("Added : " ,results)
              })

              const bodyData = {
                "replyToken" : replyToken,
                "messages" : messageObj
              }
              await axios.post(CALL_REPLY_MESSAGE,bodyData,HEADER).catch(err=>console.log(err))
            }
          }

       }
       /* Not Record , Just a chat not order */
       else{
         
       }
        
      }else{
        console.log("You cannot order right now ! FUCK.")
      }
      // console.log(req.body.events)

    }
  }
  

  responseData(res)
})

/**
 * 
 * @param {*} _id_ 
 * @param {*} replyToken 
 * @return Promise<any>
 * @description Show order summary from id of day's order and reply line group by replyToken
 */
const showSummary = (_id_,replyToken) => {
  return new Promise((resolve,reject)=>{
    if(_id_ != null){
      Order.findById(_id_,async (err,results)=>{
        if(err) reject(err)
        if(results != null){
          let summaryString = ""
          const orders = results.orders
          for(let order of orders){
            const orderName = order.order_info.orderName
            summaryString = summaryString + orderName + " -> " + order.name + "\n"
            
            // await User.findOne({userId:order.userId},async(err,user)=>{
            //   console.log(user)
            //   if(user == null){
    
            //     let profile = await axios.get(CALL_GROUP_MEMBER_GET_PROFILE(config.testGroup,order.userId),HEADER)
            //     let displayName = profile.data.displayName
            //     console.log(displayName)
    
            //     summaryString = summaryString + order.name +"\n"
    
            //     const newUser = new User({
            //       userId : order.userId,
            //       displayName: displayName,
            //       name: order.name,
            //       orders:[orderName]
            //     })
    
            //     newUser.save()
                
            //   }else{
            //     summaryString = summaryString + user.name +"\n"
    
            //     // Order.findOneAndUpdate({userId:order.userId})
    
            //   }
            // })
          }
          
          await axios.post(CALL_REPLY_MESSAGE,{replyToken:replyToken,messages:[makeTextMessageObj(summaryString)]},HEADER)
          // console.log(results)
          // return results
          resolve(results)
        }
      })
    }
  })  
}



router.all("*",(req,res,next)=>{
  res.redirect("/")
})

export default router;
