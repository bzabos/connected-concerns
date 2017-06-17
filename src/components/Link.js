import React, {Component} from 'react'


class Link extends Component {
  render() {
    const {source, target, value} = this.props.datum
    return (
        <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            style={{
              "stroke": "#999",
              "strokeOpacity": "0.6",
              "strokeWidth": Math.sqrt(value)
            }}/>
    )
  }
}

export default Link


/////
// var ExpenseVisualization = {
//   enter(selection) {
//     selection.select("rect.expenseRect")
//         .attr("x", (d) => -d.size / 2)
//         .attr("y", (d) => -d.size / 2)
//         // …
//         .attr("stroke-width", 0);
//     selection.select("rect.textBG")
//         .attr("opacity", 0)
//         // …
//         .attr("fill", "#fafafa");
//     selection.select("text")
//     // …
//         .attr("opacity", 0)
//         .text((d) => d.name);
//
//     selection
//         .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
//   },
//
//   update(selection) {
//     selection.select("rect.expenseRect")
//         .transition().duration(duration)
//         .attr("width", (d) => d.size)
//         .attr("height", (d) => d.size)
//     // … animate box in;
//     selection.select("text")
//     // … position text element;
//     selection.select("rect.textBG")
//     // … position text background;
//     selection
//         .transition().duration(duration)
//         .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
//   }
// }

// class ExpenseComponent extends React.Component {
//   componentDidMount() {
//     // wrap element in d3
//     this.d3Node = d3.select(this.getDOMNode());
//     this.d3Node.datum(this.props.data)
//         .call(ExpenseVisualization.enter);
//   }
//
//   shouldComponentUpdate(nextProps) {
//     if (nextProps.data.update) {
//       // use d3 to update component
//       this.d3Node.datum(nextProps.data)
//           .call(ExpenseVisualization.update);
//       return false;
//     }
//     return true;
//   }
//
//   componentDidUpate() {
//     this.d3Node.datum(this.props.data)
//         .call(ExpenseVisualization.update);
//   }
//
//   render() {
//     // …
//   }
// }
