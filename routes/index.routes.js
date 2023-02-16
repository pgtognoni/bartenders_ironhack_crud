const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const page = req.url.split('/')[1];
  console.log(page);
  res.render("index", { session: req.session.user || undefined, page});
});

router.get("/about", (req, res, next) => {
  res.render("about");
});
///// API testings */


module.exports = router;
