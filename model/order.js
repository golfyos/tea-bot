
import mongoose , {Schema} from 'mongoose'


const Order = Schema({
  userId: String,
  timestamp: Date,
  orderName: String,
  name:String,
})

export default mongoose.model("Order",Order)