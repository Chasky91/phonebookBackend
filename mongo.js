import mongoose from 'mongoose'

const password = process.argv[2]
const url = `mongodb+srv://davidfull:${password}@cluster0.noxuk.mongodb.net/phoneBookDB?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url).catch(err => {
    console.log(err)
})

//defino el schema
const phoneSchema = new mongoose.Schema({
    name:String,
    number: Number
})

//defino el modelo
const Phone = mongoose.model('Phone', phoneSchema)

if(process.argv.length < 3){    
    console.log('give a password ')
    process.exit(1)
} else {
    if(process.argv.length > 3){        
        
        const name = process.argv[3]
        const number = process.argv[4]

        console.log(name, number)      
                        
        const phone = new Phone({
            name,
            number
        })
        
        phone.save().then(result => {
            console.log(`added ${name} ${number} to phonebook`)
            mongoose.connection.close()
        }) 
    } else {
        //Uso el modelo para buscar varios registros
        Phone.find({}).then( result  => {
            console.log("Phonebook: ")
            result.forEach( persona => {
                console.log(`${persona.name}  ${persona.number}` )                
            })
            mongoose.connection.close()
        })
    }
}




