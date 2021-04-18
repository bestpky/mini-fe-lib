import reconcile from './reconcile'

// rootInstance用来缓存一帧虚拟dom
let rootInstance = null

export default function render(element, parentDom) {
    // prevInstance指向前一帧
    const prevInstance = rootInstance
    // element参数指向新生成的虚拟dom树
    const nextInstance = reconcile(parentDom, prevInstance, element)
    // 调用完reconcile算法(即diff算法)后将rooInstance指向最新一帧
    rootInstance = nextInstance
}
