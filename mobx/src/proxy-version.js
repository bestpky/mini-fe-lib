import EventEmitter from './event'

const em = new EventEmitter()
let currentFn
let obId = 1

const autorun = fn => {
    const warpFn = () => {
        currentFn = warpFn
        fn()
        currentFn = null
    }
    warpFn()
}
// 使用WeakMap是为了解决记录每个key的问题
const map = new WeakMap()
// 比起defineProperty好处： 不用遍历
const observable = obj => {
    return new Proxy(obj, {
        get: (target, propKey) => {
            if (typeof target[propKey] === 'object') {
                return observable(target[propKey])
            } else {
                if (currentFn) {
                    const id = String(obId++)
                    if (!map.get(target)) {
                        map.set(target, {
                            [propKey]: id // id跟key一对一绑定
                        })
                    }
                    em.on(id, currentFn)
                }
                return target[propKey]
            }
        },
        set: (target, propKey, value) => {
            if (target[propKey] !== value) {
                target[propKey] = value
                const mapObj = map.get(target)
                if (mapObj && mapObj[propKey]) {
                    em.emit(mapObj[propKey])
                }
            }
            return true
        }
    })
}

export { autorun, observable }
