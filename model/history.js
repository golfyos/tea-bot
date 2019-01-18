import mongoose , {Schema} from 'mongoose'

const Historys = Schema({
  order: String,
  timestamp: Date,
  orderer : String,
  orders: []
})

export default mongoose.model("History",Historys)