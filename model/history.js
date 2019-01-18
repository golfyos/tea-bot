
import mongoose , {Schema} from 'mongoose'
import Order from './order'

const Historys = Schema({
  orderer: String,
  datetime: Date,
  orderers: [{Order}]
})

export default mongoose.model("History",Historys)