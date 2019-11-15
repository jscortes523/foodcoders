const express = require('express')
const wrapAsync = require('../lib/wrap-async')
const Recipe = require('../models/recipe')
const { weeklyTemplate } = require('../helpers/recommendations')
const router = express.Router()

router.get('/:recipeId',wrapAsync(getRecipe))
    .get('/query/byCategories',wrapAsync(getRecipeByCategories))
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
        const {recipeId} = req.params
        const recipe = Recipe.findOne({_id:recipeId})

        res.status(200).json(recipe)
    }catch(err){
        next(err)
    }
}

async function getRecipeByCategories(req, res, next){
    try{                
        const {categories} = req.body               
        console.log(categories)
        const recipes = await Recipe.findByCategories(categories)
        
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