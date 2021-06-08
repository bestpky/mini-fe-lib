// 创建DOM的操作
export function createDom(vDom, isUpdate) {
    let dom
    // 检查当前节点是文本还是对象
    if (vDom.type === 'TEXT') {
        dom = document.createTextNode(vDom.props.nodeValue)
    } else {
        dom = document.createElement(vDom.type)

        // 将vDom上除了children外的属性都挂载到真正的DOM上去
        if (vDom.props) {
            Object.keys(vDom.props).forEach(item => {
                if (item !== 'children') {
                    if (item.indexOf('on') === 0) {
                        dom.addEventListener(item.substr(2).toLowerCase(), vDom.props[item], false)
                    } else {
                        dom[item] = vDom.props[item]
                    }
                } else {
                    if (isUpdate) {
                        vDom.props[item].forEach(c => {
                            dom.appendChild(createDom(c))
                        })
                    }
                }
            })
        }
    }

    return dom
}

// 更新DOM的操作
export function updateDom(dom, prevProps, nextProps) {
    // 处理props
    Object.keys(prevProps)
        .forEach(name => {
            // 老的存在，新的没了，取消
            if (name !== 'children' && !Object.hasOwnProperty.call(nextProps, name)) {
                if (name.indexOf('on') === 0) {
                    dom.removeEventListener(name.substr(2).toLowerCase(), prevProps[name], false)
                } else {
                    dom.removeAttribute(name)
                }

            }
        })
    Object.keys(nextProps)
        .forEach(name => {
            if (name !== 'children') { 
                // 新的存在，老的没有，新增
                if (name.indexOf('on') === 0) {
                    // 要先移除，否则事件方法会执行多次
                    dom.removeEventListener(name.substr(2).toLowerCase(), prevProps[name], false)
                    dom.addEventListener(name.substr(2).toLowerCase(), nextProps[name], false)
                } else {
                    if (dom[name] !== nextProps[name]) {
                        console.log(dom, name, nextProps)
                        // dom.setAttribute(name, nextProps[name])
                        dom[name] = nextProps[name]
                    }
                }

            }
        })
    // 处理children，需要传key
    const {children: oldChildren} = prevProps
    const {children: newChildren} = nextProps
    newChildren.forEach((newChild, index) => {
        if (oldChildren.findIndex(oldChild => oldChild.props.key === newChild.props.key) !== index) {
            if (!oldChildren[index]) {
                dom.appendChild(createDom(newChild, true))
            }else {
                dom.replaceChild(createDom(newChild, true), dom.childNodes[index])
            }
        }
    })
    oldChildren.forEach((oldChild, index) => {
        if (newChildren.findIndex(newChild => newChild.props.key === oldChild.props.key) !== index) {
            if (!newChildren[index]) {
                dom.removeChild(dom.childNodes[index])
            }
        }
    })

}
