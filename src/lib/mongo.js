const mongoose = require('mongoose')
const {config} = require('../config')

const MONGO_URI = `mongodb+srv://${config.dbUser}:${config.dbPaswword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`

function connectDB(){
    
    if(mongoose.connection.readyState !== mongoose.connection.states.connected){

        const opts= { 
            useNewUrlParser: true, 
            useUnifiedTopology:true, 
            useCreateIndex:true 
        }         

        mongoose.connect(MONGO_URI,opts,
            (err)=>{
                if(err) console.log('Error',err)

                console.log('Connected:',`You are Connected to Zuper Fit Data Base: ${config.dbName}`)
            })        
    }
}

module.exports = connectDB
