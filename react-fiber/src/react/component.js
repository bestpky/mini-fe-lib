import {useState} from './use-state'

export class Component {
  constructor(props) {
      this.props = props
  }
}

// 转成函数组件
export function transfer(Component) {
  return function (props) {
      const component = new Component(props)
      let [state, setState] = useState(component.state)
      component.props = props
      component.state = state
      component.setState = setState

      return component.render()
  }
}