import React , {Component} from 'react'
import axios from 'axios'
import {Button,Spinner} from 'reactstrap'

import { HOST } from "../config/config"
const CALL_LIST_HISTORY = HOST + "/api/v1/history/orders"

class ListHistory extends Component{


  state = {
    restaurant : [],
    isLoading : true
  }

  componentDidMount = async () => {
    const result = await axios.get(CALL_LIST_HISTORY)
    console.log("result: ",result)
    const orders = result.data.data
    let res = []

    console.log("orders", orders)

    for(const item of orders){
      const order = item.order

      const newData = {
        id: item._id,
        name: order,
        orders: item.orders
      }

      if(order===""){

        /**
         * @type {Date}
         */
        const time = new Date(item.timestamp)
        const timeList = [time.getHours(),time.getMinutes(),time.getSeconds()]
        const dateList = [time.getDate(),(time.getMonth()+1),time.getFullYear()]
        order = dateList.join("/") + "\n" + timeList.join(":")

        newData.name = order

      }
      res.push(newData)
    }

    this.setState({restaurant:res,isLoading:false})
  }


  goToOrderHistory = (id,orders) =>{
    const url = this.props.location.pathname + "/order"
    this.props.history.push(url,{data:orders,id})
  }

  render(){

    const ListRestaurant = this.state.restaurant.map(item=><Button onClick={()=> this.goToOrderHistory(item.id,item.orders)} color="primary" size="lg" block>{item.name}</Button>)
    console.log(this.state.restaurant)
    console.log("props",this.props)
    if(this.state.isLoading){
      return(
        <div><Spinner type="grow" color="primary" />
        <Spinner type="grow" color="secondary" />
        <Spinner type="grow" color="success" />
        <Spinner type="grow" color="danger" /></div>
      )
    }
    return(
      <div>
        {ListRestaurant.length > 0 ? ListRestaurant : <div>No order today!</div>}
      </div>
    )
  }
} 

export default ListHistory