/** @jsx createElement */
import { useState, createElement } from './react'

export function List() {
    const [list, setList] = useState(Array.from(Array(1), (_, i) => i + 1))
    function push() {
        const temp = [...list]
        temp.push(list.length + 1)
        setList(temp)
    }
    function pop() {
        const temp = [...list]
        temp.pop()
        setList(temp)
    }
    return [
        <button onClick={push}>push</button>,
        <button onClick={pop}>pop</button>,
        <ul>
            {list.map(item => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    ]
}
