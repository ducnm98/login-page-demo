var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  res.render('nextPage', {mess: req.params.name});
});

router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('nextPage', {mess: ''});
});

module.exports = router;
