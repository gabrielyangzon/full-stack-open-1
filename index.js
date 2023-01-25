const express = require("express")
const morgan = require("morgan")


const app = express()


app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));



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

    response.json(personsData)
})


/// get person by id
app.get(`${url}/persons/:id`,(request,response) => {

        let id = Number(request.params.id)

        let person = personsData.find(p => p.id === id)

        if(person){
            response.json(person)
        }
        else{
            response.status(404).end("User not found")
        }
})


/// add person
app.post(`${url}/persons`,(request,response) => {
    let body = request.body

    let {id , name , number } = body


    let existing = personsData.filter(c => c.name.toLowerCase() === name.toLowerCase()).length

    if(isNullOrEmpty(name) ||isNullOrEmpty(number)){
        return response.status(409).json({error: "The name or number is missing"})
    }
    else if(existing !== 0){
        return response.status(409).json({error: "The name already exists in the phonebook"})
    }
    else {

        let newPerson = {
                ...body , 
                id: Math.floor(Math.random() * Date.now())
            }

        personsData = personsData.concat(newPerson)
        return response.json(personsData)

    }
})


/// delete person by id
app.delete(`${url}/persons/:id`,(request,response) => {

       let id = Number(request.params.id)

        let person = personsData.find(p => p.id === id)

        if(person){

           

            personsData = personsData.filter(p => p.id !== id)

            response.send(`${person.name} deleted`)
        }
        else{
            response.status(404).end("User not found")
        }

})



app.get('/info',(request,response) => {
    response.send(`<p>Phonebook has info for ${personsData.length} people</p> 
                   <p>${Date().toLocaleString()}</p>`)
})



const port = 3001

app.listen(port, ()=> {
    console.log(`app listening in ${port}`)
})


function isNullOrEmpty(value) {
    return value == null || value === "";
}