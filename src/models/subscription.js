const mongoose = require('mongoose')
const _ = require('lodash')
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

SubscriptionSchema.statics.subscribe = async function({customerId, plan}){

    let currentSubscription = {}
    
    const subscription = await this.findOne({customerId})    
    const currentDate = moment()
    const endDate = currentDate.add(1, 'M')
    
    const suscribePlan = {
        planId:Schema.Types.ObjectId(plan._id),
        startAt:currentDate.toISOString(),
        endAt:endDate.toISOString(),        
        amount:plan.amount,
        quantity:plan.quantity,
        active:true,
        interval:'MONTH'
    }

    if(!_.isEmpty(subscription)){ 

        currentSubscription = new ({
            ...subscription
        }) 
        
        currentSubscription.currentPeriodStart=currentDate.toISOString()
        currentSubscription.currentPeriodEnd=endDate.toISOString()          
        
    }else{
                
        currentSubscription  = new SubscriptionSchema({
            currentPeriodStart:currentDate.toISOString(),
            currentPeriodEnd:endDate.toISOString(),
            active:true,
            customerId,
            plans:[]
        })
    }

    currentSubscription.plans.push(suscribePlan)

    const upsertedSubscription = await currentSubscription.save()

    return upsertedSubscription
}

SubscriptionSchema.statics.unsubscribe = async function({customerId}){

    const subscription = await this.updateOne({customerId, $elemMatch:{'plans.active':true}},{active:false,'plans.active':false})

    return subscription
}

module.exports = mongoose.model('Subscription',SubscriptionSchema)