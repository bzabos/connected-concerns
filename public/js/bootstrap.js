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
    element: document.getElementById('graph'),
    projection: 'mercator',
    fills: {
      defaultFill: "#ABDDA4"
//      win: '#0fa0fa'
    },
//    scope: 'usa',
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

    filteredLinks = _(graph.links).chain()
        .map(function (link) {

          link.origin = _(graph.nodes).findWhere({id: link.source}).geo;
          link.destination = _(graph.nodes).findWhere({id: link.target}).geo;

          return link.origin && link.destination && link;
        })
        .filter(function (v) {return !!v})
        .value();

    abstractLinks = _(graph.links).filter(function (v) {return !v.origin || !v.destination});

    var arcOptions = {strokeWidth: 1, arcSharpness: 1.4};
    mapGraph.arc(filteredLinks, arcOptions);

    d3.selectAll('.datamaps-arc')
      .data(filteredLinks)
      .attr({
        id: function(link) {return [link.verb, link.source, link.target].join('-')},
        'class': function (link) {return 'datamaps-arc ' + link.verb}
      });

    d3.select('#graph .arc').append('text');

    _(filteredLinks).each(function (link) {
      var origin = _(graph.nodes).findWhere({id: link.source}),
          destination = _(graph.nodes).findWhere({id: link.target});

      d3.select('#graph .arc text')
        .append('textPath')
        .text([origin.name, link.verb, destination.name].join(' '))
        .attr({
          'xlink:href': '#' + [link.verb, link.source, link.target].join('-'),
          'class': 'datamaps-arc-label ' + link.verb,
          title: [origin.name, link.verb, destination.name].join(' ')
        });
    });

    var $g = d3.selectAll('g'),
        $text = $g.select('text');

    var hideText = function () {$text.style('display', 'none')};
    var redrawText = _(function (e) {
          $text.style('font-size', 18/e.scale);
          $text.style('display', 'block');
        }).debounce(100);

    var redrawAbstractArcs = _(function (e) {



        }).debounce(100);

    var previousScale = 1;
    var handleZoomChanged = function () {
          if (previousScale !== d3.event.scale) {hideText()}

          $g.attr({transform: "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")"});

          if (previousScale !== d3.event.scale) {redrawText(d3.event)}

          redrawAbstractArcs();

          previousScale = d3.event.scale;
        };

    var zoom = d3.behavior.zoom()
          .on("zoom", handleZoomChanged);

    mapGraph.svg.call(zoom);

    d3.select('svg')
      .append('g').attr({'class': 'abstract-nodes'})
        .append('rect').attr({'class': 'abstract-node', x: 5, y: 5, height: 20, width: 150});



    /*

     * on zoom, find bottom of the viewport, draw a rectangle, then draw an arc "originating" from Entity,
     * but ending up on translated pixel coordinates
     *
     * get pixel coordinates of present source/target, and arc to known coordinates of <rect>

    */

    // note: projection takes coordinates in [lng,lat] order

//    d3.select('rect').attr({
//      x: mapGraph.projection([-2.617156, 51.494355])[0],
//      y: mapGraph.projection([-2.617156, 51.494355])[1]
//    });


    abstractArcs = mapGraph.svg.append('g')
      .attr({'class': 'abstract-arcs'});

    abstractArcs = abstractArcs.selectAll('.abstract-arc')
      .data(abstractLinks, JSON.stringify);

    abstractArcs
      .enter()
        .append('path')
        .attr('class', 'abstract-arc')
        .style('stroke-linecap', 'round')
        .style('stroke', function(datum) {
          if ( datum.options && datum.options.strokeColor) {
            return datum.options.strokeColor;
          }
          return  arcOptions.strokeColor
        })
        .style('fill', 'none')
        .style('stroke-width', function(datum) {
          if ( datum.options && datum.options.strokeWidth) {
            return datum.options.strokeWidth;
          }
          return arcOptions.strokeWidth;
        })
        .attr('d', function(datum) {
          var originXY = mapGraph.latLngToXY(datum.origin.latitude, datum.origin.longitude);
          var destXY = [5, 5]; //self.latLngToXY(datum.destination.latitude, datum.destination.longitude);
          var midXY = [ (originXY[0] + destXY[0]) / 2, (originXY[1] + destXY[1]) / 2];
          return "M" + originXY[0] + ',' + originXY[1] + "S" + (midXY[0] + (50 * arcOptions.arcSharpness)) + "," + (midXY[1] - (75 * arcOptions.arcSharpness)) + "," + destXY[0] + "," + destXY[1];
        });

    abstractArcs.exit()
        .transition()
        .style('opacity', 0)
        .remove();



  });

})();
