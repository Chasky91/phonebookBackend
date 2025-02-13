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
    name: String,
    number: String
})

phoneSchema.set('toJSON', {
    transform:(doc, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})



export default  mongoose.model('Phone', phoneSchema)
