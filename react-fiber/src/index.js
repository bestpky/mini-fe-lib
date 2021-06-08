/** @jsx createElement */
import { render } from './react-dom'
import { createElement } from './react'

import CounterClass from './counter-class'
import CounterFunc from './counter-func'
import { List } from './list'

function SimpleDiv() {
    return <div>简单的div</div>
}

render(<CounterClass />, document.getElementById('root'))
