
import mongoose , {Schema} from 'mongoose'


const Historys = Schema({
  order : Schema.Types.ObjectId,
  datetime: Number,
  orderer: String
})

export default mongoose.model("History",Historys)