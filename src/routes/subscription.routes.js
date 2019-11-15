const express = require('express')
const Subscription = require('../models/subscription')
const Plan = require('../models/plan')

const router = express.Router()

router.post('/', subscribe)
    .get('/', getSubscription)
    .put('/', unsubscribe)

async function subscribe(req, res, next){
    try {
        const {
            userId,
            planId
        } = req.body

        const plan = await Plan.findOne({_id:planId})

        
    } catch (error) {
        next(next)
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