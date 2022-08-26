require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('body', function getBody (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status - :response-time ms :body'))

app.get('/' , (request, response) => {
  response.send('<h1>Hello World </h1>')
})

app.get('/api/persons' , (request, response) => {
  console.log(response)
  console.log('Listing all contacts')
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id' , (request, response) => {
  const id = Number(request.params.id)
  let person = persons.find(person => person.id === id)

  if (person) {
     response.json(person)
    } else {
      response.statusMessage = "This user id does not exist"
      response.status(404).end()
    }
  })

  app.get('/info' , (request, response) => {
    const phonebook = persons.length
    let date = new Date()
    console.log(date)
    response.send(`
    <p>Phonebook has info for ${phonebook} people</p>
    <p>${date}</p>
    `)
})

app.delete('/api/persons/:id' , (request, response) => {
  const id = Number(request.params.id)
  person = persons.find(person => person.id === id)
  persons = persons.filter(person => person.id !== id)

  if (person) {
    response.status(204).end()
  } else {
    statusMessage = 'This person dont exist in the database'
    response.status(404).end()
  }
})

// const idGenerator = () => {
//   const id = Math.floor(Math.random() * 99999)
//   return id
// }

// const checkName = (name) => {
//   const findPerson = persons.map(person => person.name).includes(name)
//   return findPerson
// }

app.post('/api/persons' , (request, response) => {
  const body = request.body

  if (!body.name) { // check if there is a name in the body post request
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) { // check if there is a number in the body post request
    return response.status(400).json({
      error: 'number missing'
    })
  }

  // if (checkName(body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'})
  // }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPeson => {
    response.json(person)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
