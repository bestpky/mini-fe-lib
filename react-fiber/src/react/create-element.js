function createTextVDom(text) {
    return {
        type: 'TEXT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

export default function createElement(type, props, ...children) {
    // 核心逻辑不复杂，将参数都塞到一个对象上返回就行
    // children也要放到props里面去，这样我们在组件里面就能通过this.props.children拿到子元素
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === 'object' ? child : createTextVDom(child)
            })
        }
    }
}
