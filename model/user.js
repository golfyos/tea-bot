import mongoose from 'mongoose'

const User = mongoose.Schema({
  userId : String,
  displayName : String,
  name: String,
  orders:[String]
})

export default mongoose.model("User",User)