const express = require('express')
const router = express.Router()
const axios = require('axios');
const fileUploader = require('../../config/cloudinary.config')
const Cocktail = require('../../models/Cocktail.model')
const User = require("../../models/user-model")

const { isLoggedIn } = require('../../middlewares/islogged');


/* Create cocktail */
router.get('/create', isLoggedIn, (req, res) => {
  const page = req.url.split('/')[1];

  res.render('cocktail/new-cocktail', { page, update: false, session: req.session.user || undefined, theme: req.cookies.theme || undefined })
})

router.post('/create', fileUploader.single('image'), isLoggedIn ,async (req, res) => {
  const page = req.url.split('/')[1];
  const body = req.body

  let img = ''
  if (!req.file) {
    switch (body.servingGlass){
      case 'Martini' : img = '/images/martini.png' ; break;
      case 'Tumbler' : img = '/images/tumbler.png' ; break;
      case 'Nick N` Nora' : img = '/images/nickNnora2.png' ; break;
      case 'Highball' : img = '/images/highball.png' ; break;
      case 'Coupette': img = '/images/coupette.png' ; break;
      case 'Other' : img = '/images/other-cocktail.png' ; break;
    }
  } else {
    img = req.file.path;
  }

 
  let ingredients = null;
  if (body.ingredients.trim().length > 0) {
    ingredients = body.ingredients.trim().split(',')
  }

  try {
    const cocktailCreated = await Cocktail.create({
      ...body, 
      image : img ,
      creator: req.session.userId,
      ingredients: ingredients
    }) 

    const cocktailId = cocktailCreated._id
    const userId = req.session.userId
    const userUpdate = await User.findByIdAndUpdate( userId, { $push: { creations : cocktailId } }, {new: true})
    console.log(userUpdate)
    res.redirect('/user/profile')
  } catch (error) {
    console.log(error.name)
    if (error.code === 11000) {
        let key = 'name'
        let errorMessage = 'Name already exists'; 
        res.render('cocktail/new-cocktail', { page, errorMessage, key, cocktail : body || undefined, update: true, session: req.session.user || undefined, theme: req.cookies.theme || undefined })
      } else {
        if (error.name === 'ValidationError') {
            const key = Object.keys(error.errors)[0];
            let errorMessage = error.errors[key].message
            console.error(errorMessage);
            res.render('cocktail/new-cocktail', { page, errorMessage, key, cocktail : body || undefined, update: true, session: req.session.user || undefined, theme: req.cookies.theme || undefined })
          } else {
            console.error(error);
            res.render('cocktail/new-cocktail', {page, error, cocktail : body || undefined, update: true, session: req.session.user || undefined, theme: req.cookies.theme || undefined})
        }
    }
}
})

 /* Search for a cocktail recipe in local DB */


 const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;
  console.log('shuffling array')
  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

router.get('/cocktails-search', isLoggedIn , async (req, res) => {
  const page = req.url.split('/')[1];
  try {
    const user = await User.findById(req.session.userId).populate('creations')
    const historysArr = user.searchHistory;
    let searchHistory = []

    const result = await Promise.all(historysArr.map(async history => {
      let drinksApi = {};
      await axios({
          method: 'GET',
          url: 'https://api.api-ninjas.com/v1/cocktail?name=' + history,
          headers: { 'X-Api-Key': 'ypvsJtMeGB4U0viT9PWG7w==TtcrrPL7KZdEFtGm'},
          contentType: 'application/json',   
        })
        .then((data) => {
          drinksApi = data.data
          return drinksApi;
        })
        .then(data => { 
          data.forEach(drink => {
          searchHistory.push(drink)})
        }) .catch((err) => console.log(err))   
      
    }))


    const final = await shuffle(searchHistory);

  res.render('cocktail/search-cocktail', { user , page, session: req.session.user || undefined, cocktailsApi:  final, theme: req.cookies.theme || undefined })

  } catch(error) {
      console.error(error);
  }  
})


router.post('/search', isLoggedIn, async (req, res) => {
  const page = req.url.split('/')[1];
  try {
    const user = await User.findById(req.session.userId)
    const historyArr = user.searchHistory;
    const userId = req.session.userId;
    const string = req.body.cocktail;
    
    const cocktailsFound = await Cocktail.find( { name: { $regex: string, $options:"i" } } ).populate('creator')
  
    let drinksApi={}
  
    await axios({
      method: 'GET',
      url: 'https://api.api-ninjas.com/v1/cocktail?name=' + string,
      headers: { 'X-Api-Key': 'ypvsJtMeGB4U0viT9PWG7w==TtcrrPL7KZdEFtGm'},
      contentType: 'application/json',   
    }).then((data) => {
       drinksApi = data.data
    })
    .catch((err) => console.log(err))
  
    if (drinksApi.length !== 0) {   
      if (historyArr.includes(string) === false) {
        const userUpdate = await User.findByIdAndUpdate(userId, { $push: { searchHistory: string }}, {new: true}) 
        if(historyArr.length > 10) {
          const removefirst = await User.findByIdAndUpdate(userId, { $pop: { searchHistory: -1}})
        }
      }
    }

    res.render('cocktail/search-results', { page, cocktailsDb: cocktailsFound, cocktailsApi : drinksApi, session: req.session.user || undefined, theme: req.cookies.theme || undefined})

  } catch (error) {
    console.error(error);
  }

})
    
    
 /* Modify a cocktail recipe  */

router.get('/:cocktailId/modify', isLoggedIn, async (req, res) => {
  const page = req.url.split('/')[2];
  console.log(page)
  const cocktail = await Cocktail.findById(req.params.cocktailId)
  
  res.render('cocktail/new-cocktail', { page, cocktail, update: true, session: req.session.user || undefined, theme: req.cookies.theme || undefined })
}) 


router.post('/:cocktailId/modify', fileUploader.single('image'), isLoggedIn, async (req, res) => {
  const body = {...req.body}
  const page = req.url.split('/')[1];
  let img = ''
  if (!req.file) {
    switch (body.servingGlass){
      case 'Martini' : img = '/images/martini.png' ; break;
      case 'Tumbler' : img = '/images/tumbler.png' ; break;
      case 'Nick N` Nora' : img = '/images/nickNnora2.png' ; break;
      case 'Highball' : img = '/images/highball.png' ; break;
      case 'Coupette': img = '/images/coupette.png' ; break;
      case 'Other' : img = '/images/other-cocktail.png' ; break;
    }
  } else {
    img = req.file.path;
  }
  let ingredients = null;
  if (body.ingredients.trim().length > 0) {
    ingredients = body.ingredients.trim().split(',')
  }
  
  try {
    
    await Cocktail.findByIdAndUpdate(req.params.cocktailId, {
      ...body, 
      ingredients: ingredients,
      image : img ,
    })
    res.redirect('/user/profile')
  } catch (error) {
    console.log(error.name)
    if (error.code === 11000) {
        let key = 'name'
        let errorMessage = 'Name already exists'; 
        res.render('cocktail/new-cocktail', { page, errorMessage, key, cocktail : req.body || undefined, update: true, session: req.session.user || undefined, theme: req.cookies.theme || undefined })
      } else {
        if (error.name === 'ValidationError') {
            const key = Object.keys(error.errors)[0];
            let errorMessage = error.errors[key].message
            console.error(errorMessage);
            res.render('cocktail/new-cocktail', { page, errorMessage, key, cocktail : req.body || undefined, update: true, session: req.session.user || undefined, theme: req.cookies.theme || undefined })
          } else {
            console.error(error);
            res.render('cocktail/new-cocktail', {page, error, cocktail : req.body || undefined, update: true, session: req.session.user || undefined, theme: req.cookies.theme || undefined})
        }
    }
  }

})

  
/* Delete a cocktail recipe */ 

router.get('/:cocktailId/delete', isLoggedIn, async (req, res) => {
    await Cocktail.findByIdAndDelete(req.params.cocktailId)
    res.redirect('/user/profile')
})


module.exports = router;


/* Save a cocktail recipe from API*/

router.get('/:cocktailName/save', isLoggedIn, async (req, res) => {
  const userId = req.session.userId
  const userUpdate = await User.findByIdAndUpdate(userId, { $push: { favourites : req.params.cocktailName } }, {new: true})
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

router.get("/remove/:name", async (req, res) => {
  const id = req.session.userId;
  const name = req.params.name;
  try {
    await User.findByIdAndUpdate(id, { $pull: { favourites : name } }, {new: true})
    
    res.redirect('/user/profile')
  //  ($pull: {favourites : name })
  } catch (error) {
    console.log(error);
   }
})