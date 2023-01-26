const mongoose = require('mongoose')

let dotenv = require('dotenv')
let dotenvExpand = require('dotenv-expand')
let myEnv = dotenv.config()

const envParam = process.argv.slice(2)

/// get password from cli
process.env.MONGO_PASSWORD = envParam[0]
/// get name from cli
let personName = envParam[1]
/// get phone number
let personNumber = envParam[2]

dotenvExpand.expand(myEnv)

const url = process.env.MONGO_URL

mongoose.set('strictQuery',false)


mongoose.connect(url)
.then(()=>{
  
  console.log('connected')
  
  if(personName){
    savePerson()
  }
  else{
    printPersons()
  }
})
.catch(e=>console.log(e));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Person = mongoose.model("PersonsData" , personSchema)


const person = new Person({
    name : personName,
    number : personNumber
})

function savePerson(){
  person.save().then(result => {
      console.log("saved",result)
    
      mongoose.connection.close()
  }).catch(e => console.log(e))
}

function printPersons(){
    Person.find({}).then((result) => {
        
     let allPerson = result.map(p => {  
            return { 
                    name : p.name , 
                    number : p.number 
                  }}
                  )
      console.log(allPerson)
         mongoose.connection.close();
  })

  
}


