import mongoose from "mongoose"

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connect to  url ', url )


mongoose.connect(url)
    .then( result => {
        console.log('connected to mongodb')
    })
    .catch( err => {
        console.log('error connecting to mongodb ',err.message)
    })

const phoneSchema = new mongoose.Schema({
    name: {
        type:String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{2}-\d{5}$/.test(v)
            },
            message: props => `El numero proporcionado no es el adecuado ${props.value}`        
        },
        required: [true, "El numero es requerido"]
    }
})

phoneSchema.set('toJSON', {
    transform:(doc, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})



export default  mongoose.model('Phone', phoneSchema)
