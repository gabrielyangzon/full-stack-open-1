require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const mongoose = require('mongoose')

const Person = require("./models/person")

const app = express()

const unknownEndpoint = (request,response) => {
    response.status(400).send({error : "Unknown endpoint"})
}



const erroHandler = (error,request ,response,next ) => {

     console.log(error.name)

    if(error.name === "CastError"){
        response.status(400).end({error : "something wrong with id"})
    }else{
        response.status(400).end({error : error.message})
    }
}




app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => `request ${JSON.stringify(req.body)}`);
app.use(morgan(':method :url :status :response-time ms - :body'));




///

let url = "/api"

let personsData = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(request,response) => {
    response.send("Hello app")
})


/// get all persons
app.get(`${url}/persons`,(request,response) => {

    ///nodb
    //response.json(personsData)

    ///mongodb
    Person.find({}).then((result) => {     
        response.json(result)       
    })   
})


/// get person by id
app.get(`${url}/persons/:id`,(request,response,next) => {

        ///nodb
        //let id = Number(request.params.id)
        //let person = personsData.find(p => p.id === id)

        // if(person){
        //     response.json(person)
        // }
        // else{
        //     response.status(404).end("User not found")
        // }

        ///mongodb
        Person.findById(request.params.id)
            .then((result) => {               
                if(result){
                    response.json(result)
                }
                else{
                    response.status(404).json("User not found")
                }
            })
            .catch(error => next(error))   
})


/// add person
app.post(`${url}/persons`,(request,response) => {
    let body = request.body

    let {id , name , number } = body

    ///nodb
    // let existing = personsData.filter(c => c.name.toLowerCase() === name.toLowerCase()).length

    // if(isNullOrEmpty(name) ||isNullOrEmpty(number)){
    //     return response.status(409).json({error: "The name or number is missing"})
    // }
    // else if(existing !== 0){
    //     return response.status(409).json({error: "The name already exists in the phonebook"})
    // }
    // else {

    //     let newPersonId = isNullOrEmpty(id) || id === 0 ? 
    //        Math.floor(Math.random() * Date.now()) : id

    //     let newPerson = {
    //             ...body , 
    //             id:  newPersonId
    //     }

    //     personsData = personsData.concat(newPerson)
    //     return response.json(personsData)

    // }

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
            response.status(401).send("something wrong happened")
        }
    })
    
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
app.put(`${url}/persons/:id`, (request,response , next)=> {
         let body = request.body

        let {id , name , number } = body

        ///nodb
        // let person = personsData.find(p => p.id === id)

        // if(person){

        //     let updatedPersonsData = personsData.map(p => p.id === id ? {id: id, name : name , number} : p)

        //     console.log(updatedPersonsData)
        //     personsData = updatedPersonsData

        //     response.send(`${person.name} updated`)
        // }
        // else{
        //     response.status(404).end("User not found")
        // }

         const updatedPerson = {
            name: name ,
            number: number 
         }   

        ///mongodb
        Person.findByIdAndUpdate(id , updatedPerson , {new : true})
        .then(result => {
            console.log(result)
            response.status(200).send({message : result})
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
            response.status(404).send("Users not found")
        }
    })
})


app.use(unknownEndpoint)
app.use(erroHandler)


const port = process.env.PORT || 3001
app.listen(port, ()=> {
    console.log(`app listening in ${port}`)
})



function isNullOrEmpty(value) {
    return value == null || value === "";
}