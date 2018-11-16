
import mongoose , {Schema} from 'mongoose'


const Order = Schema({
  datetime: Number,
  orders: [{
    userId : String,
    order_info: {
      orderName : String,
      timestamp: String,
    },
    name: String
  }]
})

export default mongoose.model("Order",Order)