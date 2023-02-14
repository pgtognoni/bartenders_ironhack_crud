const express = require('express')
const router = express.Router()
const axios = require('axios');

const Cocktail = require('../../models/Cocktail.model')
const User = require("../../models/user-model")

const { isLoggedIn } = require('../../middlewares/islogged');


/* Create cocktail */
router.get('/create', isLoggedIn, (req, res) => {
    res.render('cocktail/new-cocktail', { update: false, session: req.session.user || undefined })
})

router.post('/create', isLoggedIn ,async (req, res) => {
    const body = req.body
    console.log(body)
    const cocktailCreated = await Cocktail.create({
      ...body,
      ingredients: body.ingredients.split(' ')
    })
    const cocktailId = cocktailCreated._id
    const userId = req.session.userId
    const userUpdate = await User.findOneAndUpdate( userId, { $push: { creations : cocktailId } }, {new: true})
    console.log(userUpdate)
    res.redirect('./creations')
  })

/* GET all cocktails */ 

 router.get('/creations', isLoggedIn, async (req, res) => {
  try {
    const allCocktails = await Cocktail.find()
    console.log('All cocktails :', allCocktails)
    res.render('cocktail/all-cocktails', { cocktails : allCocktails, session: req.session.user || undefined })
  } catch (error) {
    console.log('Route to all recipes', error)
  }
})

 /* Search for a cocktail recipe in local DB */

 router.get('/cocktails-search', (req, res) => {
  res.render('cocktail/search-cocktail', { session: req.session.user || undefined})
})


router.get('/search', async (req, res) => {
  //console.log(req.query.cocktail)
  //Cocktail.createIndex({ name: "text" });
  //const cocktailsFound = await Cocktail.find({ $text: { $search: req.query.cocktail } })
  const cocktailsFound = await Cocktail.find( { name: { $regex: req.query.cocktail, $options:"i" } } )
  console.log(cocktailsFound)
  let drinksApi={}
  await axios({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/cocktail?name=' + req.query.cocktail,
    headers: { 'X-Api-Key': 'ypvsJtMeGB4U0viT9PWG7w==TtcrrPL7KZdEFtGm'},
    contentType: 'application/json',   
  }).then((data) => {
     drinksApi = data.data
   // console.log (drinksApi)
  })
  .catch((err) => console.log(err))
 // drinksApiArray = findCocktailInApi(req.query.cocktail)
 // console.log(drinksApiArray)

  //console.log(cocktailsApi)
  res.render('cocktail/search-results', { cocktails : cocktailsFound, cocktailsApi : drinksApi, session: req.session.user || undefined})
})
    
    
 /* Modify a cocktail recipe  */

router.get('/:cocktailId/modify', isLoggedIn, async (req, res) => {
    const cocktail = await Cocktail.findById(req.params.cocktailId)
    console.log({ cocktail })
    res.render('cocktail/new-cocktail', { cocktail, update: true, session: req.session.user || undefined })
  }) 


router.post('/:cocktailId/modify', isLoggedIn, async (req, res) => {
  console.log('anything')
    await Cocktail.findByIdAndUpdate(req.params.cocktailId, {
      ...req.body,
      ingredients: req.body.ingredients.split(' '),
    })
    res.redirect('../creations')
  })

  
/* Delete a cocktail recipe */ 

router.get('/:cocktailId/delete', isLoggedIn, async (req, res) => {
    await Cocktail.findByIdAndDelete(req.params.cocktailId)
    res.redirect('../creations')
})


module.exports = router;


/* Save a cocktail recipe from API*/

router.get('/:cocktailName/save', isLoggedIn, async (req, res) => {
  const userId = req.session.userId
  const userUpdate = await User.findByIdAndUpdate(userId, { $push: { favorites : req.params.cocktailName } }, {new: true})
  console.log(userUpdate) 
})


router.get('/allcocktails', isLoggedIn, async (req, res) => {
  //const cocktails = await Cocktail.find()
  let drinksApi={}
  await axios({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/cocktail?name=' + 'martini',
    headers: { 'X-Api-Key': 'ypvsJtMeGB4U0viT9PWG7w==TtcrrPL7KZdEFtGm'},
    contentType: 'application/json',   
  }).then((data) => {
     drinksApi = data.data
   // console.log (drinksApi)
  })
  .catch((err) => console.log(err))
  cocktails = drinksApi
  //console.log(cocktails)   
  res.render('cocktail/display-cocktails', { cocktails })
})