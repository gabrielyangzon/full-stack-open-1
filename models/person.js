const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.MONGO_URL

mongoose.set('strictQuery',false)

mongoose.connect(url)
.then(()=> console.log('connected to mongodb'))
.catch(err => console.log(`error connecting to mongodb ${err.message}`));

const personSchema = new mongoose.Schema({
  name: {
    type : String,
    minLength : 3,
    required : true
  },
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("PersonsData" , personSchema)




