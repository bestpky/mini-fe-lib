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

### 异步处理

redux-thunk 和 redux-promise 用法实际上比较类似，都是触发一个 function/promise 让中间件自己决定 dispatch 真正异步数据的时机，这对于大部分场景来说已经足够了。
但是对于异步情况更复杂的场景，我们往往要写很多业务代码，一个异步结果返回后可能需要对应修改 store 里多个部分，这样就面临一个困惑的问题：业务代码是放在 action 层还是 reducer 里？
