require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
const { response } = require('express')

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
  Person.findById(request.params.id)
    .then(result => {
      if(result) {
        response.json(result)
      } else {
        response.statusMessage = "This user id does not exist"
        response.status(404).end()
      }
    })
  })

  app.get('/info' , (request, response) => {
    Person.find({})
      .then(result => {
        let phonebook = result.length
        let date = new Date()
        response.send(`
        <p>Phonebook has info for ${phonebook} people</p>
        <p>${date}</p>
        `)
      })
})

app.delete('/api/persons/:id' , (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons' , (request, response, next) => {
  const body = request.body

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPeson => {
    response.json(person)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id' , (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
