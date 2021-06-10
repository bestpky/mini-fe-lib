import {EventEmitter} from '@pky/fe-utils/dist/event-emitter'

// 原理：每defineProperty一个属性时全局的obId会递增
const em = new EventEmitter()
let currentFn
let obId = 1

const autorun = fn => {
    // currentFn = fn
    // fn()
    // currentFn = null
    // 在 autorun 以及对可观察对象的值修改时都要需要做依赖收集
    const warpFn = () => {
        currentFn = warpFn
        fn()
        currentFn = null
    }
    warpFn()
}

const observable = obj => {
    // 用 Symbol 当 key；这样就不会被枚举到，仅用于值的存储；
    const data = Symbol('data')
    obj[data] = JSON.parse(JSON.stringify(obj))
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
            observable(obj[key])
        } else {
            // 每个 key 都生成唯一的 channel ID
            const id = String(obId++)
            Object.defineProperty(obj, key, {
                get: function () {
                    if (currentFn) {
                        em.on(id, currentFn)
                    }
                    return this[data][key]
                },
                set: function (v) {
                    // 值不变时不触发
                    if (this[data][key] !== v) {
                        this[data][key] = v
                        em.emit(id)
                    }
                }
            })
        }
    })
    return obj
}



export { autorun, observable }
