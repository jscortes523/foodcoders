const express= require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const moment = require('moment')
const wrapAsync = require('../lib/wrap-async')
const ShoppingCart = require('../models/shoppingcart')
const Recipe = require('../models/recipe')
const route = express.Router()

route.get('/',wrapAsync(getCart))
    .post('/',wrapAsync(addItem))
    .put('/:item',wrapAsync(removeItem))

async function getCart(request, response, next){
    try{

        const {customer, type } = request.body                                    

        const status = type === 'Cart' ? 'Shopping' : 'Favourite'

        const cart = await ShoppingCart.findOne({customer,type, status})

        if(_.isEmpty(cart)) next(new Error('No Items has been found'))

        response.status(200).json(cart.items)

    }catch(err){
        next(err)   
    }
}

async function addItem(request,response,next){
    try{

        const {
            customer,
            type,
            item
        } = request.body

        if(!customer || !type || !item) next(new Error('Incomplete Parameters'))

        let cart = await ShoppingCart.findOne({customer,type, status:'Shopping'})
        const recipe = await Recipe.findOne({_id:mongoose.Types.ObjectId(item)})

        if(_.isEmpty(cart)){
        
            cart = new ShoppingCart({
                customer:customer,
                type:type,
                status:type === 'WishList' ? 'Favourite' : 'Shopping',
                items:[]
            })
        }

        cart.items.push({
            price:recipe.price,
            recipe:recipe._id,
            schedule:moment().toISOString(),
            status:'Pending'
        })

        const updatedCart = await cart.save()
        console.log(updatedCart)
        response.status(201).json(updatedCart)

    }catch(err){
        next(err)
    }
}

async function removeItem(req,res,next){
    
}

module.exports = route
