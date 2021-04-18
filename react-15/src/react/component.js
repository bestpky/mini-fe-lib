import reconcile from './reconcile'

export default class Component {
    constructor(props) {
        this.props = props
        this.state = this.state || {}
    }

    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState)
        // 更新实例
        const parentDom = this.__internalInstance.dom.parentNode
        const element = this.__internalInstance.element
        reconcile(parentDom, this.__internalInstance, element)
    }
}
// 标记区分类组件和函数组件
Component.prototype.isReactComponent = {}
