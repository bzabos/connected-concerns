// http://formidable.com/blog/2015/05/21/react-d3-layouts/

import lodash from 'lodash'
import React, {Component} from 'react'
import Node from './Node'
import Link from './Link'


class Graph extends Component {
  state = {
    svgWidth: 900, // todo: pull these out of state?
    svgHeight: 900,
    nodes: null,
    links: null
  }

  componentDidMount() {
    const {width, height} = this.state
    const {fetchGraph} = this.props

    fetchGraph(width, height)
  }

  // onNodeMove() {
  //   const {nodes, links, onNodeMove} = this.props
  //   onNodeMove(nodes, links)
  // }

  render() {
    const {nodes, links, simulation, onNodeMove} = this.props
    const {container} = this.refs

    return <svg
        ref="container"
        style={{"border": "2px solid black", "margin": "20px"}}
        width={this.state.svgWidth}
        height={this.state.svgHeight}>

      {links && lodash.map(links, (link, index) => <Link
          key={link.index}
          datum={link}/>)}

      {nodes && lodash.map(nodes, (node, index) => <Node
          key={node.index}
          datum={node}
          parent={container}
          simulation={simulation}
          onNodeMove={onNodeMove}/>)}

    </svg>
  }

  // render() {
  //   return <section id="graph">
  //     <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'></svg>
  //   </section>
  // }
}

export default Graph
