import React , {Component} from 'react'
import axios from 'axios'
import {HOST} from '../config/config'

import {Button,InputGroup,InputGroupAddon,Input} from 'reactstrap'

import "../styles/SendMsg.css"
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
    const response = await axios.post(CALL_SEND_LINE,requestBody,configHeader).catch(err=>console.log("error: ",err))
    console.log(response)
    this.setState({msg:""})
  }

  _onChangeMessage = (input)=>{
    this.setState({msg:input.target.value})
  }
  render(){
    return(
      <div className="sendmsg">
        <InputGroup>
          <Input onChange={this._onChangeMessage} value={this.state.msg} type="text" placeholder="Enter your text..."/>
          <InputGroupAddon addonType="append"><Button color="success" onClick={this._sendMessage}>Send Message</Button></InputGroupAddon>
        </InputGroup>        
      </div>
    )
  }
}


export default SendMsg