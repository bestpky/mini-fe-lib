// 声明编译指示
/** @jsx DiyReact.createElement */

import DiyReact from './react'
import Count4 from './app'

function Count3() {
    const [count, setCount] = DiyReact.useState(1)

    const onClickHandler = () => {
        setCount(count + 1)
    }

    return (
        <div>
            <h3>Count: {count}</h3>
            <button onClick={onClickHandler}>Count+1</button>
        </div>
    )
}

function Count() {
    const [count, setCount] = DiyReact.useState(1)
    const [count2, setCount2] = DiyReact.useState(1)

    const onClickHandler = () => {
        setCount(count + 1)
    }

    const onClickHandler2 = () => {
        setCount2(count2 + 1)
    }

    return (
        <div>
            <h3>Count1: {count}</h3>
            <button onClick={onClickHandler}>Count1+1</button>
            <h3>Count2: {count2}</h3>
            <button onClick={onClickHandler2}>Count2+1</button>
        </div>
    )
}

function App(props) {
    return (
        <div>
            <h1 id="title">{props.title}</h1>
            <hr></hr>
            <section>
                <h2>函数组件1</h2>
                <Count></Count>
                <hr></hr>
                <h2>函数组件2</h2>
                <Count3></Count3>
                <hr></hr>
                <h2>Class组件</h2>
                <Count4></Count4>
            </section>
        </div>
    )
}

DiyReact.render(<App title="Fiber Demo" />, document.getElementById('root'))
