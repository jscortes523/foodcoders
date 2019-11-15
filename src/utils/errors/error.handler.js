const boom = require('@hapi/boom')
const { config } = require('../../config')

function withErrorStack(error, stack){
    if(config.dev){
        return {...error, stack}
    }

    return error
}

function logError(err, req, res, next){
    console.log(err)
    next(err)
}

function wrapError(err, req, res, next){
    if(!err.isBoom){
        next(boom.badImplementation(err))
    }
    next(err)
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req,res, next){
    const { 
        output: {statusCode, payload}
    } = err
    res.status(statusCode)
    res.json(withErrorStack(payload,err.stack))
}

module.exports = {
    logError,
    wrapError,
    errorHandler
}