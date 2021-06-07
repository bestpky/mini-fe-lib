// 声明编译指示
/** @jsx createElement */

import { Component, transfer, createElement } from './react'

class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 1
        }
        this.onClickHandler = this.onClickHandler.bind(this)
    }

    onClickHandler() {
        this.setState({
            count: this.state.count + 1
        })
    }

    render() {
        return (
            <div>
                <h3>Count: {this.state.count}</h3>
                <button onClick={this.onClickHandler}>Count+1</button>
            </div>
        )
    }
}

export default transfer(Counter)
