import express from 'express'
const router = express.Router();
import axios from 'axios'
import {makeTextMessageObj} from '../util/data_util.js'
import config from '../config/config'
import querystring from 'querystring'
import Order from '../model/order'

const CALL_OAUTH_LINE = "https://api.line.me/v2/oauth/accessToken"

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

router.post("/",(req,res)=>{
  console.log(req.body)
  res.status(200)
  res.json({success:true,data:req.body})
})


const CALL_SEND_MESSAGE = "https://api.line.me/v2/bot/message/push"
router.post("/send/message",async (req,res,next)=>{
  const token = await getAccessToken()
  const reqMessage = req.body.message
  const messages = [makeTextMessageObj(reqMessage)]

  const data = {
    "to" : config.milkTeaGroup,
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
  Order.find({})
    .exec()
    .then((result)=>{
      console.log(result)
      res.status(200)
      res.send({orders:result})
    })
    .catch(err=>console.log(err))
})






export default router