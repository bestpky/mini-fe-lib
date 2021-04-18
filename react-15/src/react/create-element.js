export const TEXT_ELEMENT = 'TEXT_ELEMENT'

export function createTextElement(value) {
    return createElement(TEXT_ELEMENT, { nodeValue: value })
}

/**
 * 创建虚拟dom(Plain Object)，描述一个dom元素/组件的属性和下级子元素
 * @param {*} type dom标签名、function（组件）
 * @param {*} props dom标签或组件的属性
 * @param  {...any} children element（虚拟dom）
 */
export default function createElement(type, props, ...children) {
    props = Object.assign({}, props)
    props.children = []
        .concat(...children)
        .filter(child => child != null && child !== false)
        .map(child => (child instanceof Object ? child : createTextElement(child)))
    return { type, props }
}
