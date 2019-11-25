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

        const {customer, type } = request.query                                    

        const status = type === 'Cart' ? 'Shopping' : 'Favourites'

        const cart = await ShoppingCart.findOne({customer,type, status})
                            .populate('items.recipe')        

        if(_.isEmpty(cart)) next(new Error('No Items has been found'))

        const cartDetail = cart.items.map( item => item.recipe)

        response.status(200).json(cartDetail)

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

        const status = type === 'WishList' ? 'Favourites' : 'Shopping'

        let cart = await ShoppingCart.findOne({customer,type, status})
        const recipe = await Recipe.findOne({_id:mongoose.Types.ObjectId(item)})

        if(_.isEmpty(cart)){
        
            cart = new ShoppingCart({
                customer:customer,
                type:type,
                status:status,
                items:[]
            })
        }

        cart.items.push({
            price:recipe.price,
            recipe:recipe._id,
            schedule:moment().toISOString(),
            status:'Pending'
        })
        
        let updatedCart = await cart.save()
        updatedCart = await updatedCart.populate('items.recipe')
        console.log(updatedCart)
        response.status(201).json(updatedCart.items)

    }catch(err){
        next(err)
    }
}

async function removeItem(req,res,next){
    
}

module.exports = route
