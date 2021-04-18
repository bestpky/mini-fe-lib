import instantiate from './instantiate'
import { updateDomProperties } from './update-dom'

/**
 * diff算法
 * @param {*} parentDom 父节点
 * @param {*} instance 旧的实例
 * @param {*} element 新的虚拟dom
 */
export default function reconcile(parentDom, instance, element) {
    if (instance === null) {
        const newInstance = instantiate(element)
        executeInsFunc(newInstance, 'componentWillMount')
        parentDom.appendChild(newInstance.dom)
        executeInsFunc(newInstance, 'componentDidMount')
        return newInstance
    } else if (element === null) {
        executeInsFunc(instance, 'componentWillUnmount')
        parentDom.removeChild(instance.dom)
        return null
    } else if (instance.element.type !== element.type) {
        const newInstance = instantiate(element)
        executeInsFunc(newInstance, 'componentDidMount')
        parentDom.replaceChild(newInstance.dom, instance.dom)
        return newInstance
    } else if (typeof element.type === 'string') {
        updateDomProperties(instance.dom, instance.element.props, element.props)
        instance.childInstances = reconcileChildren(instance, element)
        instance.element = element
        return instance
    } else {
        if (instance.publicInstance && instance.publicInstance.shouldcomponentUpdate) {
            if (!instance.publicInstance.shouldcomponentUpdate()) {
                return
            }
        }
        executeInsFunc(instance, 'componentWillUpdate')
        let newChildElement
        if (instance.publicInstance) {
            // 类组件
            instance.publicInstance.props = element.props
            newChildElement = instance.publicInstance.render()
        } else {
            // 函数式组件
            newChildElement = instance.fn(element.props)
        }

        const oldChildInstance = instance.childInstance
        const newChildInstance = reconcile(parentDom, oldChildInstance, newChildElement)
        executeInsFunc(instance, 'componentDidUpdate')
        instance.dom = newChildInstance.dom
        instance.childInstance = newChildInstance
        instance.element = element
        return instance
    }
}

function reconcileChildren(instance, element) {
    const { dom, childInstances } = instance
    const newChildElements = element.props.children || []
    const count = Math.max(childInstances.length, newChildElements.length)
    const newChildInstances = []
    for (let i = 0; i < count; i++) {
        newChildInstances[i] = reconcile(dom, childInstances[i], newChildElements[i])
    }
    return newChildInstances.filter(instance => instance !== null)
}

function executeInsFunc(instance, funcName) {
    if (instance['publicInstance'] && instance['publicInstance'][funcName]) {
        instance['publicInstance'][funcName]()
    }
}
