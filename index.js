const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
const axios=require('axios')
const app=express()
const mongoose=require('mongoose')
const Person=require('./models/Person')
const url=process.env.MONGODB_URI
morgan.token('data',(req) => {
  if(req.body!==undefined)
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny',{
  skip: (req,res) => req.method==='POST'
}))

app.use(morgan(':method :url :status :req[content-length] - :response-time ms :data',{
  skip:(req,res) => req.method!=='POST'
}))

app.get('/',(req,res) => {
  res.send('<h1>Phone Book</h1>')
})

app.get('/api/persons',(req,res) => {
  Person.find({}).then((result) => {
    res.json(result)
  })
})

app.get('/api/persons/:id',(req,res,next) => {
  Person.findById(req.params.id)
    .then(result => {
      if(result)
      {
        res.json(result)
      }
      else
      {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons',(req,res,next) => {
  const person=req.body//remember you have to enable/import json parser i.e app.use(express.json())
  if(person.name===undefined || person.number===undefined)
  {
    if(person.name===undefined)
    {
      return res.status(400).json({
        'error':'name is missing'
      })
    }
    else
    {
      return res.status(400).json({
        'error':'number is missing'
      })
    }
  }
  else
  {
    Person.find({ number:person.number })
      .then((result) => {
        if(result.length===1)
        {
          res.json({
            error:'number must be unique'
          })
        }
        else{

          const newPerson=new Person({
            name:person.name,
            number:person.number,
            date:Date(),
          })
          newPerson.save()
            .then(result => {
              // console.log(result)
              res.json(result)
            })
            .catch(err => next(err))

        }
      })
      .catch(error => next(error))
  }
})
app.delete('/api/persons/:id',(req,res,next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(req,res,next) => {
  const body=req.body
  const person={
    name:body.name,
    number:body.number,
  }

  Person.findByIdAndUpdate(req.params.id,person,{ new:true,runValidators:true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/info',(req,res) => {
  Person.countDocuments({}, function( err, count){
    res.send(`<div>Phonebook has info for ${count} people</div> <br> ${new Date()}`)
  })
})

const errorHandler=(error,req,res,next) => {

  if(error.name==='CastError')
  {
    return res.status(400).send({ error:'malformatted id' })
  }
  else if(error.name==='ValidationError')
  {
    console.log(error.message)
    return res.status(400).json({ error:error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT=process.env.PORT || 3001

app.listen(PORT,() => {
  console.log(`listening on port ${PORT}`)
})