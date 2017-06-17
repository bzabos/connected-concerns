color = d3.scale.category20();

var Node = React.createClass({
  render: function () {
    return (
        <circle
            r={5}
            cx={this.props.x}
            cy={this.props.y}
            style={{
              "fill": color(this.props.group),
              "stroke":"#fff",
              "strokeWidth":"1.5px"
            }}/>
    )
  }
});

var Link = React.createClass({

  render: function () {
    return (
        <line
            x1={this.props.datum.source.x}
            y1={this.props.datum.source.y}
            x2={this.props.datum.target.x}
            y2={this.props.datum.target.y}
            style={{
              "stroke":"#999",
              "strokeOpacity":".6",
              "strokeWidth": Math.sqrt(this.props.datum.value)
            }}/>
    );
  }
})

var Graph = React.createClass({
  mixins: [Radium.StyleResolverMixin, Radium.BrowserStateMixin],
  getInitialState: function() {

    var svgWidth = 900;
    var svgHeight = 900;
    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([svgWidth, svgHeight]);

    return {
      svgWidth: svgWidth,
      svgHeight: svgHeight,
      force: force,
      nodes: null,
      links: null
    }
  },
  componentDidMount: function () {
    var self = this;
    // refactor entire graph into sub component - force layout shouldn't be
    // manipulating props, though this works
    this.state.force
        .nodes(this.props.lesmis.nodes)
        .links(this.props.lesmis.links)
        .start()
    this.state.force.on("tick", function (tick, b, c) {
      self.forceUpdate()
    })
  },
  drawLinks: function () {
    var links = this.props.lesmis.links.map(function (link, index) {
      return (<Link datum={link} key={index} />)
    })
    return (<g>
      {links}
    </g>)
  },
  drawNodes: function () {
    var nodes = this.props.lesmis.nodes.map(function (node, index) {
      return (<Node
              key={index}
              x={node.x}
              y={node.y}
              group={node.group}/>
      ) })
    return nodes;
  },
  render: function() {
    return (
        <div>
          <div style={{"marginLeft": "20px", "fontFamily": "Helvetica"}}>

          </div>
          <svg
              style={{"border": "2px solid black", "margin": "20px"}}
              width={this.state.svgWidth}
              height={this.state.svgHeight}>
            {this.drawLinks()}
            {this.drawNodes()}
          </svg>
        </div>
    )
  }
});

d3.json("https://gist.githubusercontent.com/fredbenenson/4212290/raw/40be75727ab60227a2b41abe5a509d30de831ffd/miserables.json", function(error, lesmis) {
  React.render(<Graph lesmis={lesmis}/>, document.getElementById("mount-point"));
});
