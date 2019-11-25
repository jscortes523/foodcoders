const express = require('express')
const mongoose = require('mongoose')
const ShoppingCart = require('../models/shoppingcart')
const Subscription = require('../models/subscription')
const Charge = require('../models/charge')
const Benefit = require('../models/benefit')
const _ = require('lodash')
const router = express.Router()

router.put('/', purchase)

async function purchase(req, res, next){
    try {
        const {
            customer
        } = req.body

        const shoppingCart = await ShoppingCart.findOne({customer,type:'Cart', status:'Shopping'})
                                    .populate('items.recipe')

        if(_.isEmpty(shoppingCart)) next(new Error('Shopping Cart not found'))

        //Obtener los items y cambiar estado a Scheduled
        const items = shoppingCart.items.map( item => {

            //lanzar la tarea programada (enviar correo electrónico)            
            return {

                price:item.price,
                recipe: item.recipe,                
                status:item.status
            }
        }).sort( (a,b) => a.price-b.price)

        //Valida la cantidad de recetas compradas y el plan actual
        const subscription = await Subscription.findOne({customerId:customer,active:true})
                                .populate('plans.planId')
                                .populate('plans.planId.benefits')

        
        //Calcula la cantidad que cubre la suscripcion
        const subscCvgQty = items.length <= subscription.remainingQuantity ? items.length : subscription.remainingQuantity

        //Calcula el monto a partir de la cantidad que cubre la suscripcion
        const subsCvgAmount = items.slice(0,subscCvgQty).reduce( (a,b) =>  a + b.price ,0)

        let benefits = []

        //Obtiene los beneficios que tiene l plan activo
        for(let plan of subscription.plans){

            if( plan.active ){

                const { planId } = plan

                const promises = planId.benefits.map( async benefit => {

                    const temp = await Benefit.findOne({_id:mongoose.Types.ObjectId(benefit)})
                                        .populate('chargeId')
                    return {
                        benefit: temp.name,
                        amount: Math.round(temp.chargeId.value * temp.percentage)
                    }
                })
                
                benefits = await Promise.all(promises)
                
            }            
        }

        //Calcula si hay sobre costo por cobertura de la suscripcion
        const overCostRecipes = items.map( item => {
            
            return {
                charge:item.recipe.title,
               price: item.price
            }
        }).slice(subscCvgQty,items.length)

        //Resumen de facturacion
        const result = {
            recipeQty:items.length,
            subscriptionCoverage: {
                qty: subscCvgQty,
                price: subsCvgAmount
            },
            benefits:benefits,
            overCosts:overCostRecipes
        }
      
        //Actualiza el status de la suscripcion y el carrito de compras
        shoppingCart.items.forEach( item => item.status = 'Scheduled' )
        shoppingCart.status = 'Scheduled'

        subscription.remainingQuantity = items.length <= subscription.remainingQuantity ? subscription.remainingQuantity - items.length : 0

        await shoppingCart.save()
        await subscription.save()

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

module.exports = router