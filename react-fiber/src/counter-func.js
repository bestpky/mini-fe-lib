/** @jsx createElement */

import { useState, createElement } from './react'

// 函数组件
export default function CounterFunc() {
    const [count, setCount] = useState(0)
    const [count2, setCount2] = useState(0)

    const onClickHandler = () => {
        setCount(count + 1)
    }

    const onClickHandler2 = () => {
        setCount2(count2 + 1)
    }

    return [
        <h3>Count1: {count}</h3>,
        <button onClick={onClickHandler}>Count1+1</button>,
        <h3>Count2: {count2}</h3>,
        <button onClick={onClickHandler2}>Count2+1</button>
    ]
}
