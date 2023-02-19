const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const page = req.url.split('/')[1];
  console.log(req.cookies)
  res.render("index", { session: req.session.user || undefined, page, theme: req.cookies.theme || undefined });
});

// router.get("/about", (req, res, next) => {
//   res.render("about");
// });
///// API testings */

const setDay = (req, res, next) => { 
  res.cookie('theme', 'day')
  next();
}

const setNight = (req, res, next) => { 
  res.cookie('theme', 'night')
  next();
}

router.get('/setDay', setDay, (req, res) => {
  const path = req.get('referer');
  console.log(path);
  res.redirect('back')
})

router.get('/setNight', setNight, (req, res) => {
  const path = req.get('referer');
  console.log(path);
  res.redirect('back')
})

module.exports = router;
