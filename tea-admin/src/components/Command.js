import React, { Component } from "react";
import { Button } from "reactstrap";
import {HOST} from "../config/config"
import axios from 'axios'

import "../styles/Command.css";

const CALL_SEND_SUMMARY = HOST+"/api/v1/summary"
const CALL_SEND_HOWTO = HOST+"/api/v1/howto"

class CommandScreen extends Component {

  state = {
    isDisabled : false
  }

  _onSummaryClick = async()=>{
    this._setDisabledAwhile()
    const response = await axios.get(CALL_SEND_SUMMARY,{})
    console.log(response)
  }

  _onHowtoClick = async()=>{
    this._setDisabledAwhile()
    const response = await axios.get(CALL_SEND_HOWTO,{})
    console.log(response)
  }

  _setDisabledAwhile = async() =>{
    await this.setState({isDisabled:true})
    setTimeout(()=>{
      this.setState({isDisabled:false})
    },3000)
  }

  render() {
    return (
      <div className="command-list">
        <div>
          <Button disabled={this.state.isDisabled} onClick={this._onHowtoClick} style={styles.buttonStyles} color="primary">
            HOW TO
          </Button>
        </div>
        <div>
          <Button disabled={this.state.isDisabled} style={styles.buttonStyles} color="success">
            START ORDER
          </Button>
        </div>
        <div>
          <Button disabled={this.state.isDisabled} onClick={this._onSummaryClick} style={styles.buttonStyles} color="info">
            SUMMARY
          </Button>
        </div>
        <div>
          <Button disabled={this.state.isDisabled} style={styles.buttonStyles} color="warning">
            END ORDER
          </Button>
        </div>
      </div>
    );
  }
}

const styles = {
  buttonStyles: {
    "marginTop" : "20px",
    "width" : "150px",
  }
};

export default CommandScreen;
