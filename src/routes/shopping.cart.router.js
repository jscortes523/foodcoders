const express= require('express')
const wrapAsync = require('../lib/wrap-async')
const ShoppingCart = require('../models/shoppingcart')
const Recipe = require('../models/recipe')
const route = express.Router()

route.get('/',wrapAsync(getCart))
    .put('/:item',wrapAsync(addItem))
    .put('/:item',wrapAsync(removeItem))

async function getCart(request, response, next){
    try{

        const {_id} = request.user.customer                                        

        let cart = await ShoppingCart.findOne({customerId:_id,type:'Cart'})

        if(!cart){
           cart = {} 
        }

        response.status(200).json(cart)

    }catch(err){
        next(err)   
    }
}

async function addItem(request,response,next){
    try{

        const {customer} = request.params.customer                                

        if(!customer) throw new Error('Customer parameter not found')

        const {item} = request.body
        
        if(!item) throw new Error('No Recipe was selected')
                
        const opts = {
            customer,
            recipe,
            type:'Cart'
        }

        const updatedCart = await ShoppingCart.addItem(opts)

        response.status(200).json(updatedCart)

    }catch(err){
        next(err)
    }
}

async function removeItem(req,res,next){
    
}

module.exports = route
