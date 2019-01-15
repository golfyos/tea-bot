import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Navbar from './components/Navbar'


import {createSimpleLogger} from 'simple-node-logger'
const logger = createSimpleLogger()

const HOST = "http://192.168.101.75:3001"

class App extends Component {

  state = {
    msg : ""
  }

  _sendMessage = async()=>{
    const requestBody = {
      message : this.state.msg
    }

    const configHeader = {
      headers : {
        
      }
    }
    const response = await axios.post(HOST+"/api/v1/send/message",requestBody,configHeader).catch(err=>logger.log("error",err))
    console.log(response)
  }

  _onChangeMessage = (input)=>{
    this.setState({msg:input.target.value})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input onChange={this._onChangeMessage} type="text" placeholder="Enter your text..." />
          <button onClick={this._sendMessage}>Send Message</button>
        </header>
      </div>
    );
  }
}

export default App;
