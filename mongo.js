const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://diegorramos84:${password}@cluster0.fuyt0rt.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    // console.log(result, 'result')
    console.log('connected')
    // console.log(process.argv[1], process.argv[2], process.argv[3], process.argv[4])
    // console.log(process.argv.length)
    // check process.argv length
    // = 3 - list all
    // > 3 - find name
    // use find first
    // if find returns undefinied/empty add name to the phonebook
    // if a person is found, return person
    // if no arguments, list all persons

    if (process.argv.length === 3) {
      console.log('Listing all contacts....')
      Person.find({}).then(result => {
        if (result) {
          result.forEach(person => {
            console.log(`name: ${person.name}, number: ${person.number}`)
            mongoose.connection.close()
          })
        }
      })
    } else {
      // Person.find( {"name": process.argv[3]} ).then(result => {
      //   console.log(result, typeof(result), "what am I")
      //   if(result !== null && result !== "") {
      //     console.log('Contact found:')
      //     result.forEach(person => {
      //       console.log(`name: ${person.name}, number: ${person.number}`)
      //     })
      //     mongoose.connection.close()
      //   } else {
      console.log('Adding new contact')
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      console.log(person)
      person.save().then(result => {
        console.log(`${person.name} contact saved`)
        mongoose.connection.close()
      })
    }
  })
