# redux简单实现

参考 [完全理解 redux（从零实现一个 redux）](https://github.com/brickspert/blog/issues/22)

## 理解

### createStore

- 基于发布订阅模式
- 传入reducer，返回dispatch、getStore、subcribe

### reducer

fn(pervState, action) => newState
描述如何根据旧的state和action计算出新的state，纯函数

### action

一个普通的object，type为必需

```js
const action = {
  type: 'reducer中定义好的switch key'
  ...state
}
```

### combineReducers

合并reducer，相当于改state的数据结构，加多了个namespace之类的key

```js
const state = {
  module1: {
    state1: 1
    state2: 2
  },
  module2: {
    state1: 1
    state2: 1
  },
}
```

### meddleware

重写store的dispatch方法而已，就是在dispatch前后做一些操作
用函数返回函数的方式传入下一个中间件和dispatch，调用下一个中间件
