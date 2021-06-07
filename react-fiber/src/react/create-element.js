function createTextVDom(text) {
    return {
        type: 'TEXT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

export default function createElement(type, props, ...rest) {
    // children可能又是个数组，map一个列表时，需要打平
    const children = flatten(rest)
    return {
        type,
        props: {
            ...props,
            // children也要放到props里面去，这样我们在组件里面就能通过this.props.children拿到子元素
            children: children.map(child => {
                return typeof child === 'object' ? child : createTextVDom(child)
            })
        }
    }
}

function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}
