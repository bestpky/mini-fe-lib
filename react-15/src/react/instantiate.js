import { updateDomProperties } from './update-dom'
import { TEXT_ELEMENT } from './create-element'

export default function instantiate(element) {
    const { type, props = {} } = element
    const isDomElement = typeof type === 'string'
    const isClassElement = !!(type.prototype && type.prototype.isReactComponent)
    if (isDomElement) {
        // dom元素
        const isTextElement = type === TEXT_ELEMENT
        const dom = isTextElement ? document.createTextNode('') : document.createElement(type)
        updateDomProperties(dom, [], element.props)
        const children = props.children || []
        const childInstances = children.map(instantiate)
        const childDoms = childInstances.map(childInstance => childInstance.dom)
        childDoms.forEach(childDom => dom.appendChild(childDom))
        const instance = { element, dom, childInstances }
        return instance
    } else if (isClassElement) {
        // 类组件
        const instance = {}
        const publicInstance = createPublicInstance(element, instance)
        const childElement = publicInstance.render()
        const childInstance = instantiate(childElement)
        Object.assign(instance, { dom: childInstance.dom, element, childInstance, publicInstance })
        return instance
    } else {
        // 函数组件
        const childElement = type(element.props)
        const childInstance = instantiate(childElement)
        const instance = {
            dom: childInstance.dom,
            element,
            childInstance,
            fn: type
        }
        return instance
    }
}

function createPublicInstance(element, instance) {
    const { type, props } = element
    const publicInstance = new type(props)
    publicInstance.__internalInstance = instance
    return publicInstance
}
