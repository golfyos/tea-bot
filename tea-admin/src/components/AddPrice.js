import React, { Fragment, Component } from "react"
import axios from "axios"
import { InputGroup, InputGroupAddon, Input , Button } from "reactstrap"

import { HOST } from "../config/config"
const CALL_LIST = HOST + "/api/v1/listorder"
const CALL_SEND_LINE = HOST+"/api/v1/send/message"
// const CALL_ADD_PRICE = HOST+"/api/v1/addprice"

class AddPrice extends Component {
  constructor() {
    super()
    this.state = {
      orders: [],
      prices: {}
    }
  }

  componentDidMount = async () => {
    const orders = await axios.get(CALL_LIST, {})
    const data = orders.data.orders
    // console.log(data)
    this.setState({ orders: data })
  }


  onAddPrice = (e,id) => {
    const price = e.target.value
    
    this.setState((prevState=>{
      return {
        prices: {
          ...prevState.prices,
          [id]: price
        }
      }
    }))
  }

  sendPrice = async () => {
    
    /**
     * @type {Object}
     */
    const {prices} = this.state
    console.log(prices)

    /**
     * @type {Number}
     */
    let counter = 1
    let priceAccumulator = 0
    /**
     * @type {string[]}
     */
    const msgList = this.state.orders.map(order=>{
      const price = prices[order._id]
      priceAccumulator += parseInt(price)
      return `${counter++}) ${order.orderName} -> [${order.name}] \uDBC0\uDC50${price}฿ `
    })

    let msg = msgList.join("\n")
    msg = msg + `\n\uDBC0\uDCB4 total: ${priceAccumulator}฿`

    const requestBody = {
      "message" : msg
    }

    const configHeader = {
      headers : {
        "Content-Type" : "application/json",
      }
    }

    await axios.post(CALL_SEND_LINE,requestBody,configHeader)

  }


  /**
   * @type {Function}
   * @returns {boolean}
   */
  isBlankPriceField = ()=> {
    const {prices,orders} = this.state
    if(orders.length > Object.keys(prices).length){
      return true
    }
    else if(orders.length === Object.keys(prices).length){
      for(const key in prices){
        if(prices[key] === ""){
          return true
        }
      }
      return false
    }else{
      return true
    }
  }

  render() {
    const list = this.state.orders.map(order => (
      <li key={order._id}>
        {" "}
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            {" "}
            {order.orderName} [{order.name}]{" "}
          </InputGroupAddon>{" "}
          <Input size="5" onChange={(e)=>this.onAddPrice(e,order._id)} placeholder="Amount" type="number" step="1" />{" "}
          <InputGroupAddon addonType="append">฿</InputGroupAddon>
        </InputGroup>
      </li>
    ))

    const validatedButton = this.isBlankPriceField()? <Button outline color="info" disabled>Send Price</Button> : <Button color="info" onClick={this.sendPrice} >Send Price</Button>
    return (
      <Fragment>
        <div>
          <ol>{list}</ol>
          {validatedButton}
        </div>
      </Fragment>
    )
  }
}

export default AddPrice
