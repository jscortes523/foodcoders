const express = require('express')
const connectDB = require('./lib/mongo')
const bodyParser = require('body-parser')
const {config} = require('./config')
const customerRoutes = require('./routes/customer.routes')
const shoppingCartRoutes = require('./routes/shopping.cart.router')
const RecipeRoutes = require('./routes/recipe.routes')
const PlanRoutes = require('./routes/plan.routes')
const subscriptionRoutes = require('./routes/subscription.routes')

const {
    errorHandler,
    logError,
    wrapError
} = require('./utils/errors/error.handler')


const app = express()
const cors = require('cors')

app.use(cors())

const port = config.port
const env = config.envName
const router = express.Router()

//Connect Data Base
connectDB()


//Parser middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.disable('X-Powered-By')

//Routes
router.use('/customer', customerRoutes);
router.use('/cart',shoppingCartRoutes)
router.use('/recipe',RecipeRoutes)
router.use('/plan',PlanRoutes)
router.use('/subscription', subscriptionRoutes);
app.use('/api', router)

//Error middleware
//Error middleware
app.use(logError)
app.use(wrapError)
app.use(errorHandler)


app.listen(port, (err)=>{
    if(err) throw new Error(err)
    console.log(`Magic happens on port ${port} on env: ${env}`)
})
