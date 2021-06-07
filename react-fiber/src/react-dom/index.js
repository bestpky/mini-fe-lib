import {
    setWorkInProgressRoot,
    workInProgressRoot,
    setDeletions,
    setNextUnitOfWork,
    currentRoot
} from '../react/scheduler'

export function render(vDom, container) {
    const rootFiber = {
        dom: container,
        props: {
            children: [vDom]
        },
        alternate: currentRoot
    }
    setWorkInProgressRoot(rootFiber)
    setDeletions([])
    // 开启任务
    setNextUnitOfWork(workInProgressRoot)
}
