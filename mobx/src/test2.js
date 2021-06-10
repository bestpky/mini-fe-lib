import { autorun, observable } from './proxy'

// 测试proxy版本

/***************************对象**************************** */
const obj = observable({ a: 1 })
autorun(() => {
  console.log(obj.b)
})
// 支持监听新增的属性
obj.b = 2

/***************************数组**************************** */

const arr = observable([1, 2]);
autorun(() => {
  console.log(arr[2])
});
// 支持数组方法
arr.push(3)