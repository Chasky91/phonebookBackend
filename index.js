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

app.get('/api/persons', (req, res, next) => {
    Phone.find({})
        .then( phones => { 
                res.json(phones) 
        })
        .catch( err =>  next(err) )
})

app.get('/info', (req, res, next) => { 
    Phone.find({})
        .then(persons => {
            const info =  persons.length
            const date = new Date()
            res.send(`<p> Phonebook has info for  ${info} Persons </p> 
                    <br/>
                    <p> ${date}</p>
            `
        )})
        .catch(err => next(err))
    
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Phone.findById(id)
        .then( phone => {
            if (phone)  {
                res.json(phone)
            } else {
                res.status(404).end()
            }
        })
        .catch( err =>  next(err) )
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Phone.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (req, res, next) => {
    
    /*if (!req.body.name || !req.body.number) {
        return  res.status(401).send({error :"Datos faltantes en la solicitud"})
    }*/

    const phone  = new Phone ({
        name: req.body.name,
        number: req.body.number
    })

    Phone.findOne({name:req.body.name}).then( phones => { 
        if(phones) {
            console.log(phones)
            return res.status(401).send({error :"El Nombre debe ser unico"})
        } else {
            phone.save()
                .then( savePhone => {
                    res.status(201).json(savePhone)
                })
                .catch( err => next(err) )
        }
    })        
})

app.put('/api/persons/:id',(req, res, next) => {
    const id = req.params.id

    const {number, name} = req.body
    /*const person = {
        name: body.name,
        number: body.number
    }*/
    
    Phone.findByIdAndUpdate(id,{name, number}, {new:true, runValidators: true, context:'query'} )
        .then( updated => {
            res.json(updated)
        })
        .catch( err => next(err) )
})

const unkknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}
app.use(unkknownEndpoint)

const errorHAndler = (err, req, res, next) => {
    console.error(err.message)

    if(err.name === 'CastError') {
        return res.status(400).send({error: err.message})
    } else if(err.name === 'ValidationError') {
        return res.status(400).json({error: err.message})   
    } 
    next(err)
}

app.use(errorHAndler)

app.listen(PUERTO, () => {
    console.log('Server is running on port 3000')    
})