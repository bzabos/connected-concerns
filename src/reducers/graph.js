import update from 'immutability-helper';
import lodash from 'lodash'


export default (state = {
  nodes: {}
}, {type, data}) => {

  // todo: push copies on tick????

  switch (type) {
    case 'GRAPH_TICK':
      console.debug('GRAPH_TICK')
    case 'GRAPH_LOAD':
    // case 'NODE_MOVE':
      const {graph: {nodes, links, width, height}, simulation} = data
      return update(state, {
        simulation: {$set: simulation},
        nodes: {$set: lodash.keyBy(nodes, 'index')},
        links: {$set: lodash.keyBy(links, 'index')}})
    case 'NODE_MOVE':
      const {id, x, y} = data
      const node = state.nodes[id]
      lodash.assign(node, {__x: x, __y: y, fx: x, fy: y, __dx: x, __dy: y})
      // return update(state, {nodes: {[id]: {$merge: {x, y, fx: x, fy: y, dx: x, dy: y}}}})
    default:
      return state
  }
}
