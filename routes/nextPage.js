var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  res.render('nextPage', {mess: req.params.name});
});

router.get('/', function(req, res, next) {
  if (req.isAuthenticated())
    res.render('nextPage', {mess: req.user.username});
  else res.redirect('/');
});

module.exports = router;
