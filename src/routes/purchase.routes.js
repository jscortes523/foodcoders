const express = require('express')
const ShoppingCart = require('../models/shoppingcart')
const router = express.Router()

router.put('/', purchase)

async function purchase(req, res, next){
    try {
        const {
            customer
        } = req.body

        const shoppingCart = await ShoppingCart.findOne({customer,type:'Cart'})

    } catch (error) {
        next(error)
    }
}