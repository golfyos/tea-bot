
import axios from 'axios'
import querystring from 'querystring'

export class Line {
    static sendMessage() {
        
    }

    static async getAccessToken(id, secret, grantType) {

        const body = {
            grant_type: grantType, // client_credentials
            client_id: id,
            client_secret: secret
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
                method: 'post',
                data: formData,
                headers: headers
            })

            return token

        } catch(error) {
            console.log(error)
            throw error
        }
    }
}