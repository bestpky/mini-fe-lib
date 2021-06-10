import {EventEmitter} from '@pky/fe-utils/dist/event-emitter'

const em = new EventEmitter()
let currentFn
let obId = 1
const map = new WeakMap()

const autorun = fn => {
    const warpFn = () => {
        currentFn = warpFn
        fn()
        currentFn = null
    }
    warpFn()
}

const observable = obj => {
    return new Proxy(obj, {
        get: (target, key) => {
            if (typeof target[key] === 'object') {
                return observable(target[key])
            } else {
                if (currentFn) {
                    const id = String(obId++)
                    if (!map.get(target)) {
                        map.set(target, {
                            [key]: id
                        })
                    }
                    em.on(id, currentFn)
                }
                return target[key]
            }
        },
        set: (target, key, value) => {
            if (target[key] !== value) {
                target[key] = value
                const mapObj = map.get(target)
                if (mapObj && mapObj[key]) {
                    em.emit(mapObj[key])
                }
            }
            return true
        }
    })
}

export { autorun, observable }
