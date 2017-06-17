import {
    forceCenter,
    forceLink,
    forceManyBody,
    forceSimulation
} from 'd3-force'
import {json} from 'd3.promise'


export const dispatcher = {
  fetchGraph(dispatch, width, height) {
    return json("https://gist.githubusercontent.com/fredbenenson/4212290/raw/40be75727ab60227a2b41abe5a509d30de831ffd/miserables.json")
        .then(({nodes, links}) => dispatcher.loadGraph(dispatch, {nodes, links, width, height}))
  },

  loadGraph(dispatch, graph) {
    const {nodes, links, height = 800, width = 600} = graph

    // todo: abstract simulation instantiation
    const simulation = forceSimulation()
        .force("charge", forceManyBody())
        .force("center", forceCenter(width / 2, height / 2))
        .on("tick", () => dispatch({type: 'GRAPH_TICK', data: {graph, simulation}}))
        // .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )

    simulation.nodes(nodes)
    simulation.force("link", forceLink(links))


    // simulation
    //     .force("link")
    //     .links(data.links)
    graph.nodes = simulation.nodes()

    return dispatch({type: 'GRAPH_LOAD', data: {graph, simulation}})
  },

  moveNodeTo(dispatch, simulation, id, {x, y}) {

    // selection, beforeDrag, onDrag, afterDrag

    dispatch({type: 'NODE_MOVE', data: {id, x, y}})

    // return dispatch({type: 'NODE_MOVE', data: {nodes, links}})
    // return
  },

  // dragstarted(dispatch, d) {
  //   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //   d.fx = d.x;
  //   d.fy = d.y;
  // },

  // dragged(dispatch, d) {
  //   d.fx = d3.event.x;
  //   d.fy = d3.event.y;
  // },

  // dragended(dispatch, d) {
  //   if (!d3.event.active) simulation.alphaTarget(0);
  //   d.fx = null;
  //   d.fy = null;
  // }
}

export default dispatcher
