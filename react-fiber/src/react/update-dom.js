// 创建DOM的操作
export function createDom(vDom) {
    let dom
    // 检查当前节点是文本还是对象
    if (vDom.type === 'TEXT') {
        dom = document.createTextNode(vDom.props.nodeValue)
    } else {
        dom = document.createElement(vDom.type)

        // 将vDom上除了children外的属性都挂载到真正的DOM上去
        if (vDom.props) {
            Object.keys(vDom.props)
                .filter(key => key !== 'children')
                .forEach(item => {
                    if (item.indexOf('on') === 0) {
                        dom.addEventListener(item.substr(2).toLowerCase(), vDom.props[item], false)
                    } else {
                        dom[item] = vDom.props[item]
                    }
                })
        }
    }

    return dom
}

// 更新DOM的操作
export function updateDom(dom, prevProps, nextProps) {
    // 1. 过滤children属性
    // 2. 老的存在，新的没了，取消
    // 3. 新的存在，老的没有，新增
    Object.keys(prevProps)
        .filter(name => name !== 'children')
        .filter(name => !(name in nextProps))
        .forEach(name => {
            if (name.indexOf('on') === 0) {
                dom.removeEventListener(name.substr(2).toLowerCase(), prevProps[name], false)
            } else {
                dom[name] = ''
            }
        })

    Object.keys(nextProps)
        .filter(name => name !== 'children')
        .forEach(name => {
            if (name.indexOf('on') === 0) {
                dom.addEventListener(name.substr(2).toLowerCase(), nextProps[name], false)
            } else {
                dom[name] = nextProps[name]
            }
        })
}
