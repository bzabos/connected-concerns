var express = require('express');
var router = express.Router();
var lodash = require('lodash');

router.get('/nodes', function(req, res) {
  var graph = lodash.cloneDeep(require('./../public/json/graph'));
  var query = new RegExp(".*" + (req.query.q || '') + ".*", 'gi');
  var node = lodash.find(graph.nodes, function (n) {return n.name.match(query)});
  node.edges = lodash.filter(graph.edges, function (e) {return e.source_id === node.id || e.target_id === node.id});

  var edge_node_ids = lodash.pluck(node.edges, 'source_id').concat(lodash.pluck(node.edges, 'target_id'));
  node.neighbors = lodash.filter(graph.nodes, function (n) {return n.id !== node.id && lodash.contains(edge_node_ids, n.id)});

  res.send(node);
});

router.get('/nodes/:id', function(req, res) {
  var graph = lodash.cloneDeep(require('./../public/json/graph'));
  var id = +req.params.id;
  var node = lodash.findWhere(graph.nodes, {id: id});
  node.edges = lodash.filter(graph.edges, function (e) {return e.source_id === node.id || e.target_id === node.id});

  res.send(node);
});

module.exports = router;
