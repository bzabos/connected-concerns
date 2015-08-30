(function () {

  var width = window.innerWidth,
      height = window.innerHeight;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(250)
      .size([width, height]);

  var svg = d3.select("body").append("svg")
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

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter()
          .append("line")
          .attr("class", "link")
          .attr("marker-end", "url(#end)")
          .style("stroke-width", function (d) {
            return Math.sqrt(d.value || 50);
          });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
          .append('g')
          .attr("class", "node")
          .attr("width", 100)
          .attr("height", 100);

    node
          .append("rect")
            .attr('height', 20)
            .attr('width', 150)
            .attr('rx', 5)
            .attr('ry', 5)
            .style("fill", function (d) {
              return color(d.id);
            });

    node
        .append("text")
            .attr('x', 2)
            .attr('y', 18)
            .style("fill", 'white')
            .text(function (d) {
              return d.name;
            });

    node
        .call(force.drag);


    force.on("tick", function () {
      link
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

      node
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y].join() + ")"
          });
    });
  });

})();
