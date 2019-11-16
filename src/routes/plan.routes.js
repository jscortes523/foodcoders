const express =require('express')
const Plan = require('../models/plan')
const router = express.Router()

router.get('/',getAllActivePlan)

async function getAllActivePlan(req,res, next){
    try {
        
        const plans = await Plan.find({active:true})

        res.status(200).json(plans)

    } catch (error) {
        next(error)
    }
}

module.exports = router