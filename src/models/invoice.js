const mongoose = require('mongoose')

const Schema = mongoose.Schema

const InvoiceSchema = new Schema({
    createdAt: Date(),
    status:{type:String, enum:['CREATED','PAID']},
    type:{type:String, enum:['PURCHASE','SUBSCRIPTION']},
    charges:[{
        
    }]
})