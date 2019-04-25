import React , {Component} from 'react'
import axios from 'axios'
import { HOST } from "../config/config"
const CALL_LIST_HISTORY = HOST + "/api/v1/history/orders"

class ListHistory extends Component{


  state = {
    restaurant : []
  }

  componentDidMount = async () => {
    const result = await axios.get(CALL_LIST_HISTORY)
    const orders = result.data

    let res = []
    for(const item in orders){
      const order = item.order
      if(order===""){

        /**
         * @type {Date}
         */
        const time = order.timestamp
        order = time.getDate() + "/" + (time.getMonth()+1) + "/" + time.getFullYear()
      }
      res.push(order)
    }

    this.setState({restaurant:res})
  }

  render(){
    return(
      <div>
        List history
      </div>
    )
  }
} 

export default ListHistory