const mongoose = require('mongoose')

require('dotenv').config()
///
// eslint-disable-next-line no-undef
const url = process.env.MONGO_URL

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log(`error connecting to mongodb ${err.message}`))

const personSchema = new mongoose.Schema({
  name: {
    type : String,
    minLength : 3,
    required : true
  },
  number: {
    type : String,
    validate : {
      validator : function(v){
        let isValid = /\d{3}-\d{8}/.test(v) || /\d{2}-\d{7}/.test(v)

        return isValid
      },
      message : () => 'valid numbers example are : 09-1234556 and 040-22334455'
    },
    required: [true , 'User phone number required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('PersonsData' , personSchema)




