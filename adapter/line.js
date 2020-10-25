import axios from 'axios'
import querystring from 'querystring'

import config from '../config/config.json'
import { makeTextMessageObj } from '../utils/data_util'

export class Line {
    static async sendMessage(groupId, message) {
        const token = await Line.getAccessToken()
  
        const data = {
          to : groupId,
          messages : [makeTextMessageObj(message)]
        }
      
        const header = {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + token
        }

        try {
            await axios({
              url: 'https://api.line.me/v2/bot/message/push',
              method: "POST",
              data: data,
              headers: header
            })
        } catch (error) {
            console.error(error)
            throw error
        }
      
    }

    static async getAccessToken() {

        const body = {
            grant_type: 'client_credentials',
            client_id: config.line.id,
            client_secret: config.line.secret
        }

        const formData = querystring.stringify(body)
        const content_length = formData.length
    
        options.HEADER.headers["Content-Length"] = content_length

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content_length
        }

        try {

            const token = await axios({
                url: 'https://api.line.me/v2/oauth/accessToken',
                method: 'post',
                data: formData,
                headers: headers
            })

            return token

        } catch(error) {
            console.error(error)
            throw error
        }
    }
}