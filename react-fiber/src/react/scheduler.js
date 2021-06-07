import {commitRoot} from './renderer'
import {performUnitOfWork} from './reconciler'

/**--------------------------任务调度--------------------------- */
// 调度器:调度任务的优先级，高优任务优先进入Reconciler
let nextUnitOfWork = null // 下一个任务单元，指fiber节点，用于记录中断前执行到哪个节点
export let workInProgressRoot = null // 保存当前进度的树，用于commit
export let currentRoot = null // 记录上一次commit后的根节点
export let deletions = null // 这次更新要删除的节点

export function setNextUnitOfWork(v) {
  nextUnitOfWork = v
}
export function setWorkInProgressRoot(v) {
  workInProgressRoot = v
}
export function setCurrentRoot(v) {
  currentRoot = v
}
export function setDeletions(v) {
  deletions = v
}

/**
 * 明确几个点：
 * 1、一次更新包含两个阶段，reconcile阶段和commit阶段
 * 2、在reconcile阶段，包含多个时间分片
 */
export function workLoop(deadline) {
    // 可中断的reconcile阶段
    while (nextUnitOfWork && deadline.timeRemaining() > 1) {
        // 判断timeRemaining是因为performUnitOfWork可能很耗时，避免阻塞ui线程
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }

    // reconcile完成后再commit
    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot()
    }

    // 继续无限循环
    requestIdleCallback(workLoop)
}