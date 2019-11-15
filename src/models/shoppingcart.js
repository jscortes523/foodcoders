const mongoose = require('mongoose')
const Recipe = require('./recipe').schema
const Schema = mongoose.Schema

const ShoppingCartSchema = new Schema({
    customer:{type:Schema.Types.ObjectId, ref:'Customer',required:true},
    type:{type:String, enum:['WishList','Cart']},
    status:{type:String,enum:['Shopping','Scheduled','Checkout','Delivered']},
    purchaseDate:Date,
    items:[{
        servings:Number,
        price:Number ,
        recipe: Recipe,
        schedule: { type: Date },
        status:{type:String,enum:['Scheduled','Delivered']},
    }],
},{
    timestamps:true
})

ShoppingCartSchema.statics.addItem = async ({customer,item, type}) => {

    const cart = this.findOne().byType({type,customer})

    const itemIndex = cart.items.findIndex( data => data.recipe._id === item.recipe._id )

    if(itemIndex < 0){
        cart.items.push(item)
    }else{
        cart.items[itemIndex].servings = cart.items[itemIndex].servings + item.servings
    }
    
    const updatedCart = cart.save()
    return updatedCart
}

ShoppingCartSchema.statics.removeItem = async ({customer,item, type}) => {

    const cart = await this.findOne().byType({type,customer})

    const itemIndex = cart.items.findIndex( data => data.recipe._id === item.recipe._id )

    if(itemIndex < 0){
        return cart
    }else{
        cart.items.slice(itemIndex,1)
    }
    
    const updatedCart = cart.save()
    return updatedCart
}


ShoppingCartSchema.query.findByType = ({type, customerId})=>{
    const customer = mongoose.Types.ObjectId(customer)
    return this.where({
        $and:[
            {type},
            {customer}
        ]
    })
}

ShoppingCartSchema.methods.summary = () => {
   return this.items.map( item => {
        return {
            title: item.recipe.title,
            image: item.recipe.image,
            price: item.recipe.price,
            servings: item.servings,
            schedule: item.schedule
        }
    })
}

module.exports = mongoose.model('ShoppingCart',ShoppingCartSchema)