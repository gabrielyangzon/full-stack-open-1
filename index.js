require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const config = require('./utils/config')
const logger = require('./utils/logger')

const Person = require('./models/person')

const app = express()

const unknownEndpoint = (request,response) => {
  response.status(400).send({ error : 'Unknown endpoint' })
}


const errorHandler = (error,request ,response,  ) => {

  console.log(error.name)

  if(error.name === 'CastError'){
    response.status(400).end({ error : 'something wrong with id' })
  }
  else if(error.name === 'ValidationError'){
    response.status(400).json({ error : error.message })
  }else{
    response.status(400).end({ error : error.message })
  }

}




app.use(express.static('build'))
app.use(express.json())
app.use(cors())
// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => `request ${JSON.stringify(req.body)}`)
app.use(morgan(':method :url :status :response-time ms - :body'))




///

let url = '/api'



app.get('/',(request,response) => {
  response.send('Hello app')
})


/// get all persons
app.get(`${url}/persons`,(request,response) => {
  ///mongodb
  Person.find({}).then((result) => response.json(result))
})


/// get person by id
app.get(`${url}/persons/:id`,(request,response,next) => {

  ///mongodb
  Person.findById(request.params.id).then((result) => {
    if(result){
      response.json(result)
    }
    else{
      response.status(404).json('User not found')
    }
  }).catch(error => next(error))
})


/// add person
app.post(`${url}/persons`,(request,response,next) => {
  let body = request.body

  let { name , number } = body

  ///mongodb
  const person = new Person({
    name : name,
    number : number
  })

  person.save().then(result => {
    console.log(result)
    if(result){
      response.status(200).send(`User created ${result}`)
    }else{
      response.status(401).send('something wrong happened')
    }
  }).catch(error => next(error))

})


/// delete person by id
app.delete(`${url}/persons/:id`,(request,response) => {

  ///nodb
  // let id = Number(request.params.id)

  // let person = personsData.find(p => p.id === id)

  // if(person){

  //    let updatedPersonsData = personsData.filter(p => p.id !== id)

  //     personsData = updatedPersonsData

  //     response.send(`${person.name} deleted`)
  // }
  // else{
  //     response.status(404).end("User not found")
  // }

  ///mongodb
  Person.findByIdAndDelete(request.params.id).then((result) => {
    console.log(result)
    if(result){
      response.status(200).send(`User deleted ${result.name}`)
    }
    else{
      response.status(400).send('Error while deleting user')
    }
  })
})


/// update person
app.put(`${url}/persons/:id`, ( request,response ,next ) => {
  let body = request.body

  let { id, name , number } = body
  const updatedPerson = {
    name: name ,
    number: number
  }

  ///mongodb
  Person.findByIdAndUpdate(id , updatedPerson ,
    { new : true , runValidators : true , context : 'query' })
    .then(result => {
      //console.log(result)
      response.status(200).send({ message : result })
    })
    .catch(error => next(error))
})


app.get('/info',(request,response) => {
  ///no db
  // response.send(`<p>Phonebook has info for ${personsData.length} people</p>
  //                <p>${Date().toLocaleString()}</p>`)

  ///mongodb
  Person.find({}).then((result) => {
    if(result){
      response.send(`<p>Phonebook has info for ${result.length} people</p> 
                    <p>${Date().toLocaleString()}</p>`)
    }else{
      response.status(404).send('Users not found')
    }
  })
})


app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(config.PORT, () => {
  logger.info(`app listening in ${config.PORT}`)
})
