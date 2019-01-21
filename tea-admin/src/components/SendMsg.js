import React , {Component,Fragment} from 'react'
import axios from 'axios'
import {HOST} from '../config/config'

const CALL_SEND_LINE = HOST+"/api/v1/send/message"

class SendMsg extends Component {
  state = {
    msg : ""
  }

  _sendMessage = async()=>{
    const requestBody = {
      message : this.state.msg
    }

    const configHeader = {
      headers : {
        "Content-Type" : "application/json",
        "Access-Control-Request-Method": "POST"
      }
    }
    const response = await axios.post(CALL_SEND_LINE,requestBody,{}).catch(err=>console.log("error: ",err))
    console.log(response)
    this.setState({msg:""})
  }

  _onChangeMessage = (input)=>{
    this.setState({msg:input.target.value})
  }
  render(){
    return(
      <div>
        <input onChange={this._onChangeMessage} value={this.state.msg} type="text" placeholder="Enter your text..." />
        <button onClick={this._sendMessage}>Send Message</button>
      </div>
    )
  }
}

export default SendMsg