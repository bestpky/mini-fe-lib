import createElement from './create-element'
import { createDom, updateDom } from './update-dom'

/**
 * 明确几个点：
 * 1、一次更新包含两个阶段，reconcile阶段和commit阶段
 * 2、在reconcile阶段，包含多个时间分片
 */

/**--------------------------任务调度--------------------------- */
let nextUnitOfWork = null // 下一个任务单元，指fiber节点，用于记录中断前执行到哪个节点
let workInProgressRoot = null // 保存当前进度的树，用于commit
let currentRoot = null // 记录上一次commit后的根节点
let deletions = null // 这次更新要删除的节点

function workLoop(deadline) {
    // 可中断的reconcile阶段
    while (nextUnitOfWork && deadline.timeRemaining() > 1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }

    // reconcile完成后再commit
    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot()
    }

    // 继续无限循环
    requestIdleCallback(workLoop)
}
// 开启无限循环
requestIdleCallback(workLoop)

/**--------------------------reconcile阶段--------------------------- */

// performUnitOfWork用来执行任务，参数是我们的当前fiber任务，返回值是下一个任务
function performUnitOfWork(fiber) {
    const isFunctionComponent = fiber.type instanceof Function
    // 更新fiber结构，也就是diff过程
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    // 深度优先，先找第一个子元素
    if (fiber.child) {
        return fiber.child
    }

    // 没有第一个子元素了，找兄弟元素
    let temp = fiber
    while (temp) {
        if (temp.sibling) {
            return temp.sibling
        }
        // 没有兄弟元素，找上一级父元素，直到根元素，最终返回undefined
        temp = temp.return
    }
}

function updateFunctionComponent(fiber) {
    // 支持useState，初始化变量
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks = [] // hooks用来存储具体的state序列

    // 函数组件的type就是个函数，直接拿来执行可以获得DOM元素
    const children = [fiber.type(fiber.props)]

    reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    // vDom结构转换为fiber结构
    const elements = fiber.props && fiber.props.children

    reconcileChildren(fiber, elements)
}

function buildNewFiber(fiber, workInProgressFiber) {
    return {
        type: fiber.type,
        props: fiber.props,
        dom: null, // 构建fiber时没有dom，下次perform这个节点是才创建dom
        return: workInProgressFiber,
        alternate: null, // 新增的没有老状态
        effectTag: 'REPLACEMENT' // 添加一个操作标记
    }
}

function reconcileChildren(workInProgressFiber, elements) {
    // 构建fiber结构
    let oldFiber = workInProgressFiber.alternate && workInProgressFiber.alternate.child // 获取上次的fiber树
    let prevSibling = null
    let index = 0
    if (elements && elements.length) {
        // 第一次没有oldFiber，那全部是REPLACEMENT
        if (!oldFiber) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i]
                const newFiber = buildNewFiber(element, workInProgressFiber)

                // 父级的child指向第一个子元素
                if (i === 0) {
                    workInProgressFiber.child = newFiber
                } else {
                    // 每个子元素拥有指向下一个子元素的指针
                    prevSibling.sibling = newFiber
                }

                prevSibling = newFiber
            }
        }

        while (index < elements.length && oldFiber) {
            let element = elements[index]
            let newFiber = null

            // 对比oldFiber和当前element
            const sameType = oldFiber && element && oldFiber.type === element.type //检测类型是不是一样
            // 先比较元素类型
            if (sameType) {
                // 如果类型一样，复用节点，更新props
                newFiber = {
                    type: oldFiber.type,
                    props: element.props,
                    dom: oldFiber.dom,
                    return: workInProgressFiber,
                    alternate: oldFiber, // 记录下上次状态
                    effectTag: 'UPDATE' // 添加一个操作标记
                }
            } else if (!sameType && element) {
                // 如果类型不一样，有新的节点，创建新节点替换老节点
                newFiber = buildNewFiber(element, workInProgressFiber)
            } else if (!sameType && oldFiber) {
                // 如果类型不一样，没有新节点，有老节点，删除老节点
                oldFiber.effectTag = 'DELETION' // 添加删除标记
                deletions.push(oldFiber) // 一个数组收集所有需要删除的节点
            }

            oldFiber = oldFiber.sibling // 循环处理兄弟元素

            // 父级的child指向第一个子元素
            if (index === 0) {
                workInProgressFiber.child = newFiber
            } else {
                // 每个子元素拥有指向下一个子元素的指针
                prevSibling.sibling = newFiber
            }

            prevSibling = newFiber
            index++
        }
    }
}

/**--------------------------commit阶段------------------------------ */

// 统一操作DOM
function commitRoot() {
    deletions.forEach(commitRootImpl) // 执行真正的节点删除
    commitRootImpl(workInProgressRoot.child) // 开启递归
    currentRoot = workInProgressRoot // 记录一下currentRoot
    workInProgressRoot = null // 操作完后将workInProgressRoot重置
}

function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        // dom存在，是普通节点
        domParent.removeChild(fiber.dom)
    } else {
        // dom不存在，是函数组件,向下递归查找真实DOM
        commitDeletion(fiber.child, domParent)
    }
}

function commitRootImpl(fiber) {
    if (!fiber) {
        return
    }

    // const parentDom = fiber.return.dom;
    // 向上查找真正的DOM
    let parentFiber = fiber.return
    while (!parentFiber.dom) {
        parentFiber = parentFiber.return
    }
    const parentDom = parentFiber.dom

    if (fiber.effectTag === 'REPLACEMENT' && fiber.dom) {
        parentDom.appendChild(fiber.dom)
    } else if (fiber.effectTag === 'DELETION') {
        // parentDom.removeChild(fiber.dom);
        commitDeletion(fiber, parentDom)
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
        // 更新DOM属性
        updateDom(fiber.dom, fiber.alternate.props, fiber.props)
    }

    // 递归操作子元素和兄弟元素
    commitRootImpl(fiber.child)
    commitRootImpl(fiber.sibling)
}

/**--------------------------useState--------------------------- */

// 申明两个全局变量，用来处理useState
// wipFiber是当前的函数组件fiber节点
// hookIndex是当前函数组件内部useState状态计数
let wipFiber = null
let hookIndex = null
function useState(init) {
    // 取出上次的Hook
    const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]

    // hook数据结构
    const hook = {
        state: oldHook ? oldHook.state : init // state是每个具体的值
    }

    // 将所有useState调用按照顺序存到fiber节点上
    wipFiber.hooks.push(hook)
    hookIndex++

    // 修改state的方法
    const setState = value => {
        hook.state = value

        // 只要修改了state，我们就需要重新处理这个节点
        workInProgressRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot
        }

        // 修改nextUnitOfWork指向workInProgressRoot，这样下次requestIdleCallback就会处理这个节点了
        nextUnitOfWork = workInProgressRoot
        deletions = []
    }

    return [hook.state, setState]
}

function render(vDom, container) {
    workInProgressRoot = {
        dom: container,
        props: {
            children: [vDom]
        },
        alternate: currentRoot
    }

    deletions = []

    nextUnitOfWork = workInProgressRoot
}

class Component {
    constructor(props) {
        this.props = props
    }
}

function transfer(Component) {
    return function (props) {
        const component = new Component(props)
        let [state, setState] = useState(component.state)
        component.props = props
        component.state = state
        component.setState = setState

        return component.render()
    }
}

export default {
    createElement,
    render,
    useState,
    Component,
    transfer
}
