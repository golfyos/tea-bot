import React , {Component , Fragment} from 'react'
import {HOST} from '../config/config'
import axios from 'axios'

const CALL_LIST = HOST + "/api/v1/listorder"
class ListOrder extends Component {
  
  constructor(){
    super()
    this.state = {
      orders : []
    }
  }
  

  componentDidMount = async()=>{
    const orders = await axios.get(CALL_LIST,{})
    const data = orders.data.orders
    console.log("fetch: ",data)
    this.setState({orders:data})
  }

  render(){
    const list = this.state.orders.map((order)=>(<li key={order.id}>{order.orderName} [{order.name}]</li>))
    return(
      <Fragment>
        <div>
          <ul>
            {list}
          </ul>
        </div>
      </Fragment>
    )
  }
}

export default ListOrder