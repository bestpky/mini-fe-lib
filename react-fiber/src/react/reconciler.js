import { createDom } from '../react-dom/dom-operation'
import { setWipFiber, setHookIndex } from './use-state'
import { deletions } from './scheduler'

/**
 * fiber结构
 *
 * 描述节点:
 * props: {
 *      type: 标签名,
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
 * effectTag dom操作类型 REPLACEMENT | DELETION | UPDATE
 */

/**--------------------------reconciler阶段--------------------------- */

// performUnitOfWork用来执行任务，参数是我们的当前fiber任务，返回值是下一个任务
// 下一个任务就是下一个fiber节点，会按深度优先的算法找到这个节点
// 深度优先：fiber.child > fiber.sibling > fiber.return
export function performUnitOfWork(fiber) {
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
    fiber.hooks = [] // hooks用来存储具体的state序列
    setWipFiber(fiber)
    setHookIndex(0)

    // 函数组件的type就是个函数，直接拿来执行可以获得DOM元素
    const returnContent = fiber.type(fiber.props)
    const elements = Array.isArray(returnContent) ? [...returnContent] : [returnContent]
    reconcileChildren(fiber, elements)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    // 类组件
    const elements = fiber.props && fiber.props.children

    reconcileChildren(fiber, elements)
}

/**
 * diff算法
 * @param {object} workInProgressFiber
 * @param {object} elements
 */
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
            // 根据element算出新的fiber
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
