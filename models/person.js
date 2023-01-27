const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.MONGO_URL

mongoose.set('strictQuery',false)

console.log(`connecting to ${url}`)

mongoose.connect(url)
.then(()=>{
  
  console.log('connected')
  
})
.catch(err =>console.log(`error connecting to mongodb ${err.message}`));


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const person = new Person({
//     name : personName,
//     number : personNumber
// })

 function savePerson(){
  person.save().then(result => {
      console.log("saved",result)
    
      mongoose.connection.close()
  }).catch(e => console.log(e))
}

 function getAllPersons(){

    Person.find({}).then((result) => {
        
     let allPerson = result.map(p => {  
            return { 
                    name : p.name , 
                    number : p.number 
                  }}
                )
      console.log(allPerson)

      
      mongoose.connection.close();
      return allPerson
  })

  
}

module.exports = mongoose.model("PersonsData" , personSchema)




