(function () {

  var width = window.innerWidth,
      height = window.innerHeight;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-300)
      .linkDistance(250)
      .size([width, height]);

  var svg = d3.select("section#graph > svg")
      .attr("width", width)
      .attr("height", height);

  d3.json("/json/graph.json", function (error, graph) {
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    // build the arrow.
    svg.append("defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
      .enter().append("marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    // add the links and the arrows
    var link = svg.append("g").selectAll(".link")
        .data(force.links())
        .enter()
          .append("path")
          .attr('id', function (d) {return d.source.name})
          .attr("class", "link")
          .attr("marker-end", "url(#end)");
          //.style("stroke-width", function (d) {
          //  return Math.sqrt(d.value || 50);
          //});

    var link_labels = svg.selectAll('.link-label')
        .data(force.links())
        .enter()
          .append('text')
          .attr('class', 'verb')
            .append('textPath')
            .attr('xlink:href', function (d) {return '#' + d.source.name})
            .attr('startOffset', '25%')
            .text(function (d) {return d.verb});

    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter()
          .append('g')
          .attr("class", "node")
          .call(force.drag);

    // add the nodes
    node.append("circle")
        .attr("r", 5)
        .style("fill", function (d) {
          return color(d.id);
        });

    // add the text
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; })
        .style("fill", function (d) {
          return color(d.id);
        });


    // add the curvy lines
    force.on("tick", function () {
        link
          .attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
          });

      node
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y].join() + ")"
          });
    });
  });

})();
