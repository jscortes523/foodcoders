const mongoose = require('mongoose')
const validator = require('email-validator')

const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    name: {type:String, required:true},
    familyName:{type:String, required:true},
    email:{type:String, required:true},
    password: {type:String, required:true}  ,
    readings:[String] 
})

module.exports = mongoose.model('Customer', CustomerSchema)