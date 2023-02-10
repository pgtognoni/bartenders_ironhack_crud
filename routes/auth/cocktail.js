const express = require('express')
const router = express.Router()
const axios = require('axios');

const Cocktail = require('../../models/Cocktail.model')
const User = require('../../models/User.model')


/* Create cocktail */
router.get('/create', (req, res) => {
    res.render('cocktail/new-cocktail', { update: false })
  })

router.post('/create', async (req, res) => {
    const body = req.body
    console.log(body)
    await Cocktail.create({
      ...body,
      ingredients: body.ingredients.split(' ')
    })
    res.redirect('./creations')
  })

/* GET all cocktails */ 

 router.get('/creations', async (req, res) => {
  try {
    const allCocktails = await Cocktail.find()
    console.log('All cocktails :', allCocktails)
    res.render('cocktail/all-cocktails', { cocktails : allCocktails })
  } catch (error) {
    console.log('Route to all recipes', error)
  }
})

 /* Search for a cocktail recipe in local DB */


function findCocktailInApi(cocktail){
  let drinksApi={}
  axios({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/cocktail?name=' + cocktail,
    headers: { 'X-Api-Key': 'ypvsJtMeGB4U0viT9PWG7w==TtcrrPL7KZdEFtGm'},
    contentType: 'application/json',   
  }).then((data) => {
    drinksApi = data.data
    return drinksApi
  })
  .catch((err) => console.log(err))
}



router.get('/cocktail', (req, res) => {
  res.render('cocktail/search-cocktail',)
})


router.get('/cocktail/search', async (req, res) => {
  console.log(req.query.cocktail)
  const cocktailFound = await Cocktail.find({ name: req.query.cocktail})
  console.log(cocktailFound)
  let drinksApi={}
  await axios({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/cocktail?name=' + req.query.cocktail,
    headers: { 'X-Api-Key': 'ypvsJtMeGB4U0viT9PWG7w==TtcrrPL7KZdEFtGm'},
    contentType: 'application/json',   
  }).then((data) => {
    drinksApi = data.data
    console.log (drinksApi)
  })
  .catch((err) => console.log(err))
 // drinksApiArray = findCocktailInApi(req.query.cocktail)
 // console.log(drinksApiArray)

  //console.log(cocktailsApi)
  res.render('cocktail/search-cocktail', { cocktails : cocktailFound, cocktailsApi : drinksApi})
})
    
    
 /* Modify a cocktail recipe  */

router.get('/:cocktailId/modify', async (req, res) => {
    const cocktail = await Cocktail.findById(req.params.cocktailId)
    console.log({ cocktail })
    res.render('cocktail/new-cocktail', { cocktail, update: true })
  }) 


router.post('/:cocktailId/modify', async (req, res) => {
    await Cocktail.findByIdAndUpdate(req.params.cocktailId, {
      ...req.body,
      ingredients: req.body.ingredients.split(' '),
    })
    res.redirect('../creations')
  })

  
/* Delete a cocktail recipe */ 

router.get('/:cocktailId/delete', async (req, res) => {
    await Cocktail.findByIdAndDelete(req.params.cocktailId)
    res.redirect('./creations')
})


module.exports = router;
