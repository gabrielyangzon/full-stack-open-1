const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect(url)
.then(()=>console.log('connected'))
.catch(e=>console.log(e));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Person = mongoose.model("Person" , personSchema)

const person = new Person({
    name : "gabriel",
    number : "123456"
})

// person.save().then(result => {
//     console.log('person saved')

//     mongoose.connection.close();
// })