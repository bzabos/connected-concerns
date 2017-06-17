import {connect} from 'react-redux';
import Graph from '../components/Graph'
import dispatcher from '../dispatchers/graph'


const GraphContainer = connect((state, ownProps) => {
  return state
}, (dispatch, ownProps) => ({
  fetchGraph: dispatcher.fetchGraph.bind(null, dispatch),
  onNodeMove: dispatcher.moveNodeTo.bind(null, dispatch)
}))(Graph)

export default GraphContainer
export {GraphContainer}
