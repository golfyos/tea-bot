import React, { Fragment,Component } from 'react'
import axios from 'axios'

import {HOST} from '../config/config'
const CALL_LIST = HOST + "/api/v1/listorder"

class AddPrice extends Component {

  constructor(){
    super()
    this.state = {
      orders:[]
    }
  }

  componentDidMount = async()=>{
    const orders = await axios.get(CALL_LIST,{})
    const data = orders.data.orders
    console.log(data)
    this.setState({orders:data})
  }

  render(){
    const list = this.state.orders.map((order)=>(<li key={order.id}>{order.orderName} [{order.name}]</li>))
    return(
      <Fragment>
        <div>
          <ol>
            {list}
          </ol>
        </div>
      </Fragment>
    )
  }
}

export default AddPrice