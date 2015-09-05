var express = require('express');
var router = express.Router();
var graph = require('./../public/json/graph');

router.get('/nodes', function(req, res) {
  res.send(graph);
});

module.exports = router;
