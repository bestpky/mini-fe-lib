import { createDom } from '../react-dom/dom-operation'
import { setWipFiber, setHookIndex } from './use-state'
import { deletions } from './scheduler'

/**--------------------------reconciler阶段--------------------------- */

/**
 * fiber结构
 *
 * 描述节点:
 * type: 函数组件是自身，原生元素是tagName
 * props: {
 *      [属性名: string]: 属性值,
 *      children: 子节点
 * }
 * dom 真实dom
 *
 *
 * 节点关系:
 * child
 * subling
 * return
 *
 * 工作单元：
 * alternate 旧fiber
 * effectTag dom操作类型 MOUNT | DELETION | UPDATE
 */

/**
 * 执行当前fiber节点的任务
 * @param {object} fiber 当前fiber任务
 * @returns 下一个任务,指当前fiber关联的下个节点，会按深度优先的算法找到这个节点
 * 深度优先：fiber.child > fiber.sibling > fiber.return
 */
export function performUnitOfWork(fiber) {
    // 函数组件的type是它自身，这是编译jsx的结果
    const isFunctionComponent = fiber.type instanceof Function
    // 判断函数组件和原生元素，对fiber进行处理
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

// 实际上包含mount和update两个阶段
function updateFunctionComponent(fiber) {
    // 支持useState，初始化变量
    fiber.hooks = [] // hooks用来存储具体的state序列
    setWipFiber(fiber)
    setHookIndex(0)

    // 函数组件的type就是个函数，直接拿来执行可以获得DOM元素
    const returnContent = fiber.type(fiber.props)
    // 支持返回数组
    const elements = Array.isArray(returnContent) ? [...returnContent] : [returnContent]
    console.log(fiber, elements, 'func')
    reconcile(fiber, elements)
}

// 原生元素
function updateHostComponent(fiber) {
    // 首次没有dom
    if (!fiber.dom) {
        // 直接在这里创建dom了，理论上不应该在reconcile阶段操作dom
        fiber.dom = createDom(fiber)
    }
    // 子元素
    const elements = fiber.props && fiber.props.children
    console.log(fiber, elements, 'host')
    reconcile(fiber, elements)
}

/**
 * 协调器：这里的遍历不是深度优先了，是广度优先，为了顺应element的遍历
 * 协调指的是协调：
 * 1. 这个节点的节点关系：child、sibling、return，为了深度优先遍历使用
 * 2. 根据elements更新child fiber和child fiber的sibling fiber(打上操作标记)，供commit使用
 * @param {object} wipFiber 当前wip的fiber
 * @param {array} elements 子elements
 */
function reconcile(wipFiber, elements) {
    // 从child开始获取旧fiber
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    // 保存上一个兄弟节点，用于通过sibling连接这一个节点
    let prevSibling = null
    if (elements && elements.length) {
        // 没有oldFiber就是mount
        if (!oldFiber) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i]
                // element转fiber，添加return
                const newFiber = createFiber(element, wipFiber)
                // 添加child和sibling
                if (i === 0) {
                    wipFiber.child = newFiber
                } else {
                    prevSibling.sibling = newFiber
                }
                prevSibling = newFiber
            }
        } else {
            // update
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i]
                // 根据element算出新的fiber
                let newFiber = null
                // 对比oldFiber和当前element的类型
                const sameType = oldFiber && element && oldFiber.type === element.type
                if (sameType) {
                    newFiber = {
                        type: oldFiber.type,
                        props: element.props,
                        dom: oldFiber.dom,
                        return: wipFiber,
                        alternate: oldFiber, // 记录下上次状态
                        effectTag: 'UPDATE' // 添加一个操作标记
                    }
                } else {
                    if (element) {
                        // 如果类型不一样，有新的节点，创建新节点替换老节点
                        newFiber = createFiber(element, wipFiber)
                    }
                    if (oldFiber) {
                        // 如果类型不一样，没有新节点，有老节点，删除老节点
                        oldFiber.effectTag = 'DELETION'
                        // 全局收集所有需要删除的节点
                        deletions.push(oldFiber)
                    }
                }
                // 横向关联到兄弟元素，和for循环遍历elements同步
                if (oldFiber) {
                    oldFiber = oldFiber.sibling
                } else {
                    break
                }

                // 添加child和sibling
                if (i === 0) {
                    wipFiber.child = newFiber
                } else {
                    prevSibling.sibling = newFiber
                }
                prevSibling = newFiber
            }
        }
    }
}

function createFiber(element, wipFiber) {
    return {
        type: element.type,
        props: element.props,
        dom: null, // 构建fiber时没有dom，下次perform这个节点是才创建dom
        return: wipFiber,
        alternate: null, // 新增的没有老状态
        effectTag: 'MOUNT'
    }
}
