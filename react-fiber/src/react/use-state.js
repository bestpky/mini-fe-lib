import {currentRoot,workInProgressRoot,setDeletions,setNextUnitOfWork,setWorkInProgressRoot} from './scheduler'
/**--------------------------useState--------------------------- */
// 申明两个全局变量，用来处理useState
// wipFiber是当前的函数组件fiber节点
// hookIndex是当前函数组件内部useState状态计数
let wipFiber = null
let hookIndex = null

export function setWipFiber(v) {
  wipFiber = v
}
export function setHookIndex(v) {
  hookIndex = v
}
/**
 * useState 的逻辑分两块：
 * 1、初始化：从fiber的alternate拿到旧的state，没用就用init值
 * 2、提供setState方法，
 * @param {any} init 初始值
 * @returns [state, setState]
 */
export function useState(init) {
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
        setWorkInProgressRoot({
          dom: currentRoot.dom,
          props: currentRoot.props,
          alternate: currentRoot
      })

        // 修改nextUnitOfWork指向workInProgressRoot，这样下次requestIdleCallback就会处理这个节点了
        setNextUnitOfWork(workInProgressRoot)
        setDeletions([])
    }

    return [hook.state, setState]
}