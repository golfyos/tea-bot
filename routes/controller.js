import express from 'express'
const router = express.Router();
import fs from 'fs'
import axios from 'axios'
import querystring from 'querystring'
import path from 'path'
import {client_id,cliend_secret} from '../config/config'

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
      "client_id" : client_id,
      "client_secret" : cliend_secret
    }
  }

  const formData = querystring.stringify(config.body)
  const content_length = formData.length

  config.HEADER.headers["Content-Length"] = content_length


  const token = await axios.post(CALL_OAUTH_LINE,formData,config.HEADER).catch(err=>console.log(err))
  return token.data.access_token
}



const RESOURCE_FILE_CONFIG = path.resolve(__dirname,'../config/config.js')
const RESOURCE_FILE_TXT = path.resolve(__dirname,'../config/current_token.txt')



router.post("/update/config",async(req,res)=>{
  const body = req.body
  
  const new_token = await getAccessToken()

  console.log(new_token)

  fs.readFile(RESOURCE_FILE_CONFIG,'utf8',(err,data)=>{
    console.log(data)
    if(err) {
      res.status(500)
      res.send({success:false,message:err})
    }
    
    fs.readFile(RESOURCE_FILE_TXT,'utf8',async (err,data2)=>{
      console.log("data2",data2)
      let re = new RegExp(data2,"g")
      const regex = re
      let result = data.replace(regex,new_token)
      

      console.log("result: ",result)

      let saveConfig = data2.replace(regex,new_token)

      await fs.writeFile(RESOURCE_FILE_CONFIG,result,'utf8',(err)=>{
        if(err){
          res.status(500)
          res.send({success:false,message:err})
        }
      })

      await fs.writeFile(RESOURCE_FILE_TXT,saveConfig,'utf8',(err)=>{
        if(err){
          res.status(500)
          res.send({success:false,message:err})
        }
      })

    })
  })

  res.status(200)
  res.send({success:true,message:"Updated Webhook"})
})


export default router