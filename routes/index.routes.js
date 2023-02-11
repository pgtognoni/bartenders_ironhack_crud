const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { session: req.session.user || undefined});
});

module.exports = router;
