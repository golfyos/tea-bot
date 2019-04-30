import React , {Component , Fragment} from 'react'
import {Spinner} from 'reactstrap'
import {HOST} from '../config/config'
import axios from 'axios'
import "../styles/ListOrder.css"

const CALL_LIST = HOST + "/api/v1/listorder"


class ListOrder extends Component {
  
  constructor(){
    super()
    this.state = {
      orders : [],
      isLoading:true
    }
  }
  

  componentDidMount = async()=>{
    const orders = await axios.get(CALL_LIST,{})
    const data = orders.data.orders
    console.log("fetch: ",data)
    this.setState({orders:data,isLoading:false})
  }

  render(){
    const list = this.state.orders.map((order,index)=>(<li key={index}>{order.orderName} [{order.name}]</li>))

    if(this.state.isLoading){
      return (
        <div>
          <Spinner type="grow" color="primary" />
          <Spinner type="grow" color="secondary" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="danger" />
          <Spinner type="grow" color="warning" />
        </div>
      )
    }

    if(list.length === 0 ){
      return(
        <div className="order-container">
          No current order just now!
        </div>
      )
    }

    return(
      <Fragment>
        <div className="order-container">
          <ol className="list-order">
            {list}
          </ol>
        </div>
      </Fragment>
    )
  }
}

export default ListOrder