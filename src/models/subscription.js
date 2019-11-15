const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const SubscriptionSchema = new Schema({
    currentPeriodStart:Date,
    currentPeriodEnd:Date,
    customerId: {type:Schema.Types.ObjectId, ref:'Customer', required:true},
    plans: [
        {
            planId:{type:Schema.Types.ObjectId, ref:'Plan', required:true},
            startAt:Date,
            endAt:Date,
            amount:Number,
            quantity:Number,
            active:Boolean,
            interval:{type:String, default:'MONTH'}
        }
    ],
    remainingQuantity:Number,
    status:{type:String, enum:['NEW','']},
    active:Boolean
},{
    timestamps:true
})

SubscriptionSchema.statics.subscribe = async function({customerId, planId, quantity, amount}){

    const currentDate = moment()
    const endDate = currentDate.add(1, 'M')
    
    const currentSubscription  = {
        currentPeriodStart:currentDate.toISOString(),
        currentPeriodEnd:endDate.toISOString(),
        customerId,
        plans:[]
    }

    const plan = {
        planId:Schema.Types.ObjectId(planId),
        startAt:currentDate.toISOString(),
        endAt:endDate.toISOString(),        
        amount,
        quantity,
        active:true,
        interval:'MONTH'
    }

    currentSubscription.plans.push(plan)

     await this.findOneAndUpdate({customerId},{$push:{'plans':plan}},{
        new:true,
        upsert:true
    })

    const upsertedSubscription = await this.findOne({customerId})

    return upsertedSubscription
}

SubscriptionSchema.statics.unsubscribe = async function({customerId}){

    const subscription = await this.updateOne({customerId, $elemMatch:{'plans.active':true}},{active:false,'plans.active':false})

    return subscription
}

module.exports = mongoose.model('Subscription',SubscriptionSchema)