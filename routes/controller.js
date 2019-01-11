import express from 'express'
const router = express.Router();
import fs from 'fs'
import axios from 'axios'

const CALL_OAUTH_LINE = "https://api.line.me/v2/oauth/accessToken"

const getAccessToken = async () =>{
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : {
      "grant_type" : "client_credentials",
      "client_id" : "1622053629",
      "client_secret" : "bc80a788f78e98a829fc6df5f476c5dc"
    }
  }
  const token = await axios.post(CALL_OAUTH_LINE,config.body,config.headers).catch(err=>console.log(err))
  return token.access_token
}

router.post("/update/config",async(req,res)=>{
  const body = req.body
  
  const new_token = await getAccessToken()
  console.log(new_token)

  fs.readFileSync("./config/config.js",'utf8',(err,data)=>{
    if(err) {
      res.status(500)
      res.send({success:false,message:err})
    }

    fs.readFileSync("./config/current_token.txt",'utf8',async (err,data2)=>{
      const regex = /data2/g
      let result = data.replace(regex,new_token)

      let saveConfig = data2.replace(regex,new_token)

      await fs.writeFile("./config/config.js",result,'utf8',(err)=>{
        if(err){
          res.status(500)
          res.send({success:false,message:err})
        }
      })

      await fs.writeFile("./config/current_token.txt",saveConfig,'utf8',(err)=>{
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