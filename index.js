const express = require('express');
//3.7: Phonebook backend step 7
const morgan = require('morgan');
const app = express();
//3.8*: Phonebook backend step 8
morgan.token('jsonbody', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonbody'));


let persons = [
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

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

const findName = (name) => {
  return persons.find(person => person.name === name)
}


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//3.1: Phonebook backend step 1
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//3.2: Phonebook backend step 2
app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date(8.64e15).toString()}</p>`)
})

//3.3: Phonebook backend step 3
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  console.log(person)
  if(person){
    response.json(person);
  }else{
    response.status(404).end();
  }
})

//3.4: Phonebook backend step 4
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end()
})

//3.5: Phonebook backend step 5
app.use(express.json())
app.post('/api/persons', (request, response) => {
  const body = request.body;

  //3.6: Phonebook backend step 6
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }else if(!body.number){
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }else if(findName(body.name)){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})