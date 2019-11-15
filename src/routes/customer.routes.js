const express = require('express')
const wrapAsync = require('../lib/wrap-async')
const Customer = require('../models/customer')

const router = express.Router()

router.post('/register',wrapAsync(registerCustomer))

async function registerCustomer(request, response){

    console.log(request.body)
    const newCustomer = new Customer({
        ...request.body
    })

    const savedCustomer = await newCustomer.save();

    response.status(200).send(savedCustomer)

}

module.exports = router