import {drag} from 'd3-drag'
import {scaleOrdinal, schemeCategory20} from 'd3-scale'
import {event, select} from 'd3-selection'
import lodash from 'lodash'
import React, {Component} from 'react'


const color = scaleOrdinal(schemeCategory20);


class Node extends Component {
  componentDidMount() {

    this.d3 = select(this.refs.el)


    // todo: does drag behavior need to be linked up to force simulation? Is there a way to link these?
    this.d3
        .call(drag()
                .on("start", () => {
                  const {simulation} = this.props
                  // simulation.stop()
                  // simulation.restart()
                  // simulation.tick()
                })
                .on("drag", this.dragged.bind(this))
                .on("end", () => {
                  const {simulation} = this.props

                  // debugger

                  // simulation.tick()
                  simulation.alpha(1).restart()
                })
        )

    // this.d3
    //     .attr("cx", ({x=0}={}) => x)
    //     .attr("cy", ({y=0}={}) => y)

    // this.d3Node.datum(this.props.data)
    //     .call(ExpenseVisualization.enter);
  }

  componentWillReceiveProps({datum}) {
    // this.d3.data(datum)
  }

  dragged(selection, beforeDrag, onDrag, afterDrag) {
    const {datum: {index}, simulation, onNodeMove} = this.props
    const {x, y} = event

    console.debug('dragging', index, this.props.datum.group, JSON.stringify(this.props.datum))
    onNodeMove(simulation, index, {x, y}) // todo: modify this to node-moving + node-moved

    // onDrag(x, y)

    // todo: don't manip dom; dispatch an event to modify state instead

    // this.props.x = d3.event.x
    // this.props.y = d3.event.y

    // this.d3
    //     .attr("cx", this.props.x)
    //     .attr("cy", this.props.y);
  }

// function dragstarted(d) {
//   d3.select(this).raise().classed("active", true);
// }
//
//   function dragged(d) {
//   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }
//
//   function dragended(d) {
//   d3.select(this).classed("active", false);
// }

  render() {
    const {index, x, y, group} = this.props.datum

    // ;(index === 48) && this.d3 && console.debug(this.d3.datum())


    // ;(index === 48) && this.d3 && console.debug(this.d3.data())

    return <circle
        ref="el"
        index={index}
        transform={`translate(${x}, ${y})`}
        r={5}
        style={{
          "fill": color(group),
          "stroke": "#fff",
          "strokeWidth": "1.5px"
        }}/>
  }
}

export default Node
