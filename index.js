import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Phone from './models/phone.js'

const PUERTO = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//creo el token de morgan para el body
morgan.token('body', req =>  {
    return req.method === 'POST' ? JSON.stringify(req.body) : '*'
})   

const logFormat = ':method :url :status :res[content-length] - :response-time ms  :body'

app.use(morgan(logFormat))



const numeroAleatorio = () => {
    const minimo = 10
    console.log(minimo)
    const numero = Math.floor(Math.random() * (2000 - minimo+1)+minimo)
    return numero
}

//middleware    
const requestLogger = (req, res, next ) => {
    console.log( 'Method',req.method)
    console.log( 'PAth',req.path)
    console.log( 'Body',req.body)
    

    // llamamos a next 
    //cede el control al siguiente middleware.
    next()
}

app.use(requestLogger)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/persons', (req, res) => {
    Phone.find({}).then( phones => { 
            res.json(phones) 
    })
})

app.get('/info', (req, res) => { 
    const info =  persons.length
    const date = new Date()
    res.send(`<p> Phonebook has info for  ${info} Persons </p> 
            <br/>
            <p> ${date}</p>
        `
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)

    const person = persons.find(p => p.id === id)
    if (person) {
        return res.json(person)
    }        
    
    res.status(404).send('Person not found')
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).send('Person deleted')
})

app.post('/api/persons', (req, res) => {
    
    if (!req.body.name || !req.body.number) {
        return  res.status(401).send({error :"Datos faltantes en la solicitud"})
    }

    const phone  = new Phone ({
        name: req.body.name,
        number: req.body.number
    })

    Phone.findOne({name:req.body.name}).then( phones => { 
        if(phones) {
            console.log(phones)
            return res.status(401).send({error :"El Nombre debe ser unico"})
        } else {
            phone.save().then( savePhone => {
                res.status(201).json(savePhone)
            }) 
        }
    })

    

      
})

const unkknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unkknownEndpoint)

app.listen(PUERTO, () => {
    console.log('Server is running on port 3000')    
})