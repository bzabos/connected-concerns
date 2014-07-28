(function () {



  // example 1:

//  var width = 960,
//    height = 500;
//
//  var color = d3.scale.category20();
//
//  var force = d3.layout.force()
//    .charge(-120)
//    .linkDistance(30)
//    .size([width, height]);
//
//  var svg = d3.select("body").append("svg")
//    .attr("width", width)
//    .attr("height", height);
//
//  d3.json("/json/graph.json", function(error, graph) {
//    force
//      .nodes(graph.nodes)
//      .links(graph.links)
//      .start();
//
//    var link = svg.selectAll(".link")
//      .data(graph.links)
//      .enter().append("line")
//      .attr("class", "link")
//      .style("stroke-width", function(d) { return Math.sqrt(d.value || 100); });
//
//    var node = svg.selectAll(".node")
//      .data(graph.nodes)
//      .enter().append("circle")
//      .attr("class", "node")
//      .attr("r", 5)
//      .style("fill", function(d) { return color(d.id); })
//      .call(force.drag);
//
//    node.append("title")
//      .text(function(d) { return d.name; });
//
//    force.on("tick", function() {
//      link.attr("x1", function(d) { return d.source.x; })
//        .attr("y1", function(d) { return d.source.y; })
//        .attr("x2", function(d) { return d.target.x; })
//        .attr("y2", function(d) { return d.target.y; });
//
//      node.attr("cx", function(d) { return d.x; })
//        .attr("cy", function(d) { return d.y; });
//    });
//  });


  // example 2:

  mapGraph = new Datamap({
    element: document.getElementById("graph"),
//    scope: 'usa',
    fills: {
      defaultFill: "#ABDDA4",
      win: '#0fa0fa'
    },
//    data: {
//      'TX': { fillKey: 'win' },
//      'FL': { fillKey: 'win' },
//      'NC': { fillKey: 'win' },
//      'CA': { fillKey: 'win' },
//      'NY': { fillKey: 'win' },
//      'CO': { fillKey: 'win' }
//    }
  });

  d3.json("/json/graph.json", function(error, graph) {

    var filteredLinks = _(graph.links).chain()
        .map(function (link) {

          link.origin = _(graph.nodes).findWhere({id: link.source}).geo;
          link.destination = _(graph.nodes).findWhere({id: link.target}).geo;

          return link.origin && link.destination && link;
        })
        .filter(function (v) {return !!v})
        .value();

    mapGraph.arc(filteredLinks, {strokeWidth: 1, arcSharpness: 1.4});

    d3.selectAll('.datamaps-arc')
      .data(filteredLinks)
      .attr('id', function(link) {return [link.verb, link.source, link.target].join('-')})
      .attr('class', function (link) {return 'datamaps-arc ' + link.verb});

    d3.select('#graph .arc').append('text');

    _(filteredLinks).each(function (link) {
      var origin = _(graph.nodes).findWhere({id: link.source}),
          destination = _(graph.nodes).findWhere({id: link.target});

      d3.select('#graph .arc text')
        .append('textPath')
        .attr('xlink:href', '#' + [link.verb, link.source, link.target].join('-'))
        .attr('class', 'datamaps-arc-label ' + link.verb)
        .attr('title', [origin.name, link.verb, destination.name].join(' '))
        .text([origin.name, link.verb, destination.name].join(' '));
    });



//    d3.selectAll('.datamaps-arc')
//      .append("text")
//      .attr("dy", ".31em")
//      .attr("text-anchor", function(d) {return d.x < 180 ? "start" : "end"})
//      .attr("transform", function(d) {return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"})
//      .attr('xlink:href', function(link) {return '#' + [link.verb, link.source, link.target].join('-')})
//      .text(function(link) {return [link.verb, link.source, link.target].join('-')});

  });

//  arcs.arc([
//    {
//      origin: {
//        latitude: 40.639722,
//        longitude: -73.778889
//      },
//      destination: {
//        latitude: 37.618889,
//        longitude: -122.375
//      }
//    },
//    {
//      origin: {
//        latitude: 30.194444,
//        longitude: -97.67
//      },
//      destination: {
//        latitude: 25.793333,
//        longitude: -80.290556
//      },
//      options: {
//        strokeWidth: 2,
//        strokeColor: 'rgba(100, 10, 200, 0.4)'
//      }
//    },
//    {
//      origin: {
//        latitude: 39.861667,
//        longitude: -104.673056
//      },
//      destination: {
//        latitude: 35.877778,
//        longitude: -78.7875
//      }
//    }
//  ],  {strokeWidth: 1, arcSharpness: 1.4});

})();
