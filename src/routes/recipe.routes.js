const express = require('express')
const wrapAsync = require('../lib/wrap-async')
const Recipe = require('../models/recipe')
const { weeklyTemplate } = require('../helpers/recommendations')
const router = express.Router()

router.get('/',wrapAsync(getRecipe))
    .get('/query/bycategory/:category',wrapAsync(getRecipeByCategories))
    .get('/query/byContent',wrapAsync(getRecipeByContent))
    .get('/weekly/recipes/rec', wrapAsync(getWeeklyRecommendations))
    .post('/', wrapAsync(addRecipe))

async function addRecipe (req, res, next) {
    const recipe = req.body

    const newRecipe = new Recipe({
        ...recipe
    })
    
    const createdRecipe = await newRecipe.save()

    res.status(200).json(createdRecipe)
}
 
async function getRecipe(req, res, next){
    try{
        const {recipeid} = req.query
        console.log(recipeid)
        const recipe = await Recipe.findOne({_id:recipeid})

        res.status(200).json(recipe)
    }catch(err){
        next(err)
    }
}

async function getRecipeByCategories(req, res, next){
    try{                
        const {category} = req.params               
        const recipes = await Recipe.findByCategories({category,limit:10})
        
        res.status(200).json(recipes)

    }catch(err){
        next(err)
    }
}

async function getRecipeByContent(req, res, next){
    
    try{
        const {content} = req.query

        const recipes = await Recipe.findByContent(content)

        res.status(200).json({recipes})
    }catch(err){
        next(err)
    }
}

async function getWeeklyRecommendations(req,res, next){
    try {
        
        const result = []
        
        const dinner = await Recipe.randomRecipeByCategory({categories:['almuerzo'],size:7})

        const lunch = await Recipe.randomRecipeByCategory({categories:['cena'],size:7})

        const breakfast = await Recipe.randomRecipeByCategory({categories:['Desayuno'],size:7})
        
        const dessert = await Recipe.randomRecipeByCategory({categories:['postres'],size:7})

        weeklyTemplate.forEach( (item, index) => {
            item.data.push(dinner[index])
            item.data.push(lunch[index])
            item.data.push(breakfast[index])
            item.data.push(dessert[index])

            result.push(item)
        })

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}


module.exports = router