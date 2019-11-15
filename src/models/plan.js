const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PlanSchema = new Schema({
    name:{type:String, required:true},
    quantity:{type:Number, required:true},
    description:{type:String, required:true},
    amount:Number,
    active:Boolean,
    benefits:[{
        type:Schema.Types.ObjectId, ref:'Benefit'
    }]
})


module.exports = mongoose.model('Plan',PlanSchema)