import { updateDom } from '../react-dom/dom-operation'
import { deletions, setCurrentRoot, setWorkInProgressRoot, workInProgressRoot } from './scheduler'

/**--------------------------commit阶段------------------------------ */
// 渲染器：负责将变化的组件渲染到页面上

// 统一操作DOM
export function commitRoot() {
    deletions.forEach(commitRootImpl)
    commitRootImpl(workInProgressRoot.child)
    setCurrentRoot(workInProgressRoot)
    setWorkInProgressRoot(null)
}

// commit也是深度优先
function commitRootImpl(fiber) {
    if (!fiber) {
        return
    }
    // 向上查找真正的DOM
    let parentFiber = fiber.return
    while (!parentFiber.dom) {
        parentFiber = parentFiber.return
    }
    const parentDom = parentFiber.dom
    if (fiber.effectTag === 'REPLACEMENT' && fiber.dom) {
        parentDom.appendChild(fiber.dom)
    } else if (fiber.effectTag === 'DELETION') {
        commitDeletion(fiber, parentDom)
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
        // 更新DOM属性
        updateDom(fiber.dom, fiber.alternate.props, fiber.props)
    }

    // 递归操作子元素和兄弟元素
    commitRootImpl(fiber.child)
    commitRootImpl(fiber.sibling)
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
