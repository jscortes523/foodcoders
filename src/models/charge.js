const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ChargeSchema = new Schema({
    name:String,
    value:Number,
    type:String,
})

module.exports = mongoose.model('Charge',ChargeSchema)