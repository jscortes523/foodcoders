const mongoose = require('mongoose')

const Schema = mongoose.Schema

/*const ingredientschema = new Schema({
  name:{type:String,required:true},
  measure:{type:Number},
  unitMeasure:{type:String, enum:['ml','units','gr','cup','teaspoon']},
})*/

const RecipeSchema = new Schema({
  title:{type:String, required:true},
  description:{type:String},
  prepTime:{type:Number, required:true},
  images:{type:[String], default:[]},
  servings:Number,
  tags:{type:[String], default:[]},
  categories:{type:[String], default:[]},
  instructions:{type:String},
  ingredients:[String],
  price:{type:Number, default:0, required:true}
},
{
  timestamps: true
})

RecipeSchema.index({title:'text', description:'text', 'ingredients.name':'text'},{
  default_language:'none'
})

RecipeSchema.statics.randomRecipeByCategory = async function({categories,size}) {
  return await this.aggregate([
    {$match:{
      categories:{$elemMatch:{$in:categories}}}
    },
    {$sample:{
      size:size
    }
  }
  ])
}

RecipeSchema.statics.findByCategories = async function({category}) {

  return await this.find({categories:{$elemMatch:{$eq:category}}})
}

RecipeSchema.statics.findByContent = async function(content){
  return await this.find({$text:{$search:content}})
}

module.exports = mongoose.model('Recipe',RecipeSchema)