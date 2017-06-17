import React from 'react'
import {createStore} from 'redux'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import GraphContainer from './containers/GraphContainer'
import graph_reducer from './reducers/graph'

// const store = createStore(counter)
const node_store = createStore(
    graph_reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const render = () => ReactDOM.render(<Provider store={node_store}>
      <div>
        <GraphContainer />

        {/*<Counter*/}
            {/*value={store.getState()}*/}
            {/*onIncrement={() => store.dispatch({type: 'INCREMENT'})}*/}
            {/*onDecrement={() => store.dispatch({type: 'DECREMENT'})}/>*/}
      </div>
    </Provider>,
    document.getElementById('root'))


render()
// store.subscribe(render)
node_store.subscribe(render)
