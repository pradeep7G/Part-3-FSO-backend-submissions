const express=require('express');
const morgan=require('morgan');

const app=express();

morgan.token('data',(req)=>{
    if(req.body!==undefined)
    return JSON.stringify(req.body);
})

app.use(express.json());
app.use(morgan('tiny',{
    skip: (req,res) => req.method==='POST'
}));

app.use(morgan(':method :url :status :req[content-length] - :response-time ms :data',{
    skip:(req,res)=> req.method!=='POST'
}));
let persons=[
    {
        id:1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id:2,
        name:"Ada Lovelace",
        number:"39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id:4,
        name:"Mary-Poppendick",
        number:"39-23-6423122"
    }
]

app.get('/',(req,res)=>{
    res.send('<h1>Phone Book</h1>')
})

app.get('/api/persons',(req,res)=>{
    res.json(persons);
})

app.get('/api/persons/:id',(req,res)=>{
    const id=Number(req.params.id);
    const isPresent=persons.find(p => p.id === id);
    if(isPresent)
    {
        res.json(isPresent);
    }
    else{
        res.status(400).send('bad request');
    }
})

const generateId=()=>{
    const number=Math.floor(Math.random()*100000);
    return number;
}

app.post('/api/persons',(req,res)=>{
    const person=req.body;//remember you have to enable/import json parser i.e app.use(express.json())
    if(person.name===undefined || person.number===undefined)
    {
        if(person.name===undefined)
        {
            return res.status(400).json({
                "error":"name is missing"
            })
        }
        else
        {
            return res.status(400).json({
                "error":"number is missing"
            })
        }
    }
    else
    {
        const isPresent=persons.find(p => p.name===person.name);
        if(!isPresent)
        {
            const newPerson={
                ...person,
                id:generateId()
            }
            persons=persons.concat(newPerson);
            res.json(newPerson);
        }
        else
        {
            return res.status(400).json({
                "error":"name must be unique"
            })
        }
    }
})
app.delete('/api/persons/:id',(req,res)=>{
    const id=Number(req.params.id);
    persons=persons.filter(person => person.id !==id);
    res.send('deleted');
})
app.get('/info',(req,res)=>{
    res.send(`<div>Phonebook has info for ${persons.length} people</div> <br> ${new Date()}`)
})

const PORT=3001;

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})