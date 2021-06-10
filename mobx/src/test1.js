import { autorun, observable } from './defineProperty'

// 测试defineProperty版本

/***************************对象**************************** */
const obj = observable({ a: 1, b: { c: 1 } });
autorun(() => {
  if (obj.a === 2) {
    console.log(obj.b.c);
  }
});
// 正常，支持嵌套
obj.a = 2 
obj.b.c = 5;
obj.b.c = 6;
// 原本不存在的属性，添加后无法触发
autorun(() => {
  console.log(obj.d) 
})
obj.d = 'ddd' 

/***************************数组**************************** */
// 和object同样支持通过下标改值触发，和object同样不支持下标添加元素触发
// 数组操作方法无法触发
const arr = observable([1, 2]);
autorun(() => {
  console.log(arr[2])
});
arr.push(3)