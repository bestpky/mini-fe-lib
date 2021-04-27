/**
 * 发布订阅模式的事件模型
 */
export default function EventEmitter() {
    this.events = {}
}

EventEmitter.prototype.on = function (type, cb) {
    this.events[type] ? this.events[type].push(cb) : (this.events[type] = [cb])
    return this
}

EventEmitter.prototype.emit = function (type, ...rest) {
    if (this.events[type]) {
        this.events[type].forEach(cb => {
            cb(...rest)
        })
    }
    return this
}

EventEmitter.prototype.off = function (type, fn) {
    const fns = this.events[type]
    if (fns) {
        for (let i = 0; i < fns.length; i++) {
            if (fns[i] === fn) {
                fns.splice(i, 1)
                break
            }
        }
    }
    return this
}
