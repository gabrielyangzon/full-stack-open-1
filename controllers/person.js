const personRouter = require('express').Router()

const Person = require('../models/person')


/// get all persons
personRouter.get('/' , (request , response) => {
  Person.find({}).then((result) => response.json(result))
})


/// get person by id
personRouter.get('/:id' , (request ,response , next ) => {
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
personRouter.post('/' ,( request ,response , next ) => {
  const body = request.body

  const { name , number } = body

  const newPerson = new Person({
    name : name,
    number : number
  })

  newPerson.save().then(result => {
    console.log(result)
    if(result){
      response.status(200).send(`User created ${result}`)
    }else{
      response.status(401).send('something wrong happened')
    }
  }).catch(error => next(error))
})


/// delete person
personRouter.delete('/:id' , ( request, response , next ) => {
  Person.findByIdAndDelete(request.params.id).then((result) => {
    console.log(result)
    if(result){
      response.status(200).send(`User deleted ${result.name}`)
    }
    else{
      response.status(400).send('Error while deleting user')
    }
  }).catch(error => next(error))
})


personRouter.update('/:id' , ( request ,response, next ) => {
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


personRouter.get('/info' , ( request , response , next ) => {
  Person.find({}).then((result) => {
    if(result){
      response.send(`<p>Phonebook has info for ${result.length} people</p> 
                    <p>${Date().toLocaleString()}</p>`)
    }else{
      response.status(404).send('Users not found')
    }
  }).catch(error => next(error))
})

module.exports = personRouter