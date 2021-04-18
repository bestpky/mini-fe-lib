// 声明编译指示
/** @jsx DiyReact.createElement */

import DiyReact from './react'

export class App extends DiyReact.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: ['a', 'b', 'c']
        }
    }
    // handleClick() {
    //     this.setState({
    //         num: ++this.state.num
    //     })
    // }
    render() {
        return (
            <ul>
                {this.state.list.map(item => (
                    <li onClick={() => console.log(item)} key={item}>
                        {item}
                    </li>
                ))}
            </ul>
        )
    }
}

// export class Button extends DiyReact.Component {
//     render() {
//         <ul>

//         </ul>
//         // return <button onClick={this.props.handleClick}>{this.props.children}</button>
//     }
// }
