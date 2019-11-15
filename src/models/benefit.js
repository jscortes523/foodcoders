const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BenefitSchema = new Schema({
    name:{type:String,required:true},
    chargeId:{type:Schema.Types.ObjectId, ref:'Charge'},
    type:{type:String, enum:['FULL','PARTIAL']},
    percentage:Number
})


module.exports = mongoose.model('Benefit', BenefitSchema)