const express = require('express')
const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')
const Subscription = require('../models/subscription')
const Plan = require('../models/plan')

const router = express.Router()

router.post('/', subscribe)
    .get('/', getSubscription)
    .put('/', unsubscribe)

async function subscribe(req, res, next){
    try {
        const {
            customerId,
            planId
        } = req.body

        const plan = await Plan.findOne({_id:planId})

        if(_.isEmpty(plan)) next(new Error('Given plan doesn\' exist'))
            

        let currentSubscription = {}
    
        const subscription = await Subscription.findOne({customerId})    
        const currentDate = moment()
        const endDate = currentDate.add(1, 'M')
        
        const suscribePlan = {
            planId:mongoose.Types.ObjectId(plan._id),
            startAt:currentDate.toISOString(),
            endAt:endDate.toISOString(),        
            amount:plan.amount,
            quantity:plan.quantity,
            active:true,
            interval:'MONTH'
        }
    
        if(!_.isEmpty(subscription)){ 
    
            currentSubscription = new Subscription({
                ...subscription
            }) 
            
            currentSubscription.currentPeriodStart=currentDate.toISOString()
            currentSubscription.currentPeriodEnd=endDate.toISOString()          
            
        }else{
                    
            currentSubscription  = new Subscription({
                currentPeriodStart:currentDate.toISOString(),
                currentPeriodEnd:endDate.toISOString(),
                active:true,
                customerId:mongoose.Types.ObjectId(customerId),
                remainingQuantity:plan.quantity,
                plans:[]
            })
        }
    
        currentSubscription.plans.push(suscribePlan)
    
        const upsertedSubscription = await currentSubscription.save()
    
        res.status(200).json(upsertedSubscription)

    } catch (error) {
        next(error)
    }
}

async function getSubscription(req, res, next){
    try {
        
    } catch (error) {
        next(next)
    }
}

async function unsubscribe(req, res, next){
    try {
        const { subscriptionId } = req.body

        

    } catch (error) {
        next(next)
    }
}

module.exports = router