import { autorun, observable } from './defineProperty-version'
import { autorun as autorun1, observable as observable1 } from './proxy-version'

function testArr() {
    const arr = observable([1,2,3])
    arr[0] = 'fuck'
    autorun(() => {
        console.log(arr[0])
    })
    autorun(() => {
        // autorun会先执行一次
        console.log(arr[2])
    })
    arr[2] = 'u'
    autorun(() => {
        // 对于数组新增的元素，第一次是undefined，没有第二次（不执行，监听不到）
        console.log(arr[3])
    })
    arr[3] = '!!'
}

function testObj() {
    const store = observable1({ a: 1, b: { c: 1 } })
    autorun1(() => {
        if (store.a === 2) {
            console.log(store.b.c)
        }
    })
    store.a = 2
    // store.b.c = 5
    // store.b.c = 6
}

testArr()
testObj()