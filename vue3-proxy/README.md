# Vue 3简单实现

## 跑起来

```shell
npx http-server
```

## 实现思路

vue3的架构设计分为3块：Compiler编译器、Reactivity响应式、Renderer渲染

### Compiler编译器

完成将`template`转成`render`函数的过程，其中做了一些牛逼的优化
本示例省略了 Compiler 编译模块（太复杂），直接写render函数

### Reactivity响应式

- `effectWatch`收集依赖：把函数赋值给一个全局变量，再执行这个函数，这个函数中如果包含对
响应式对象的get操作，会触发getter()对依赖的收集
- `ref`和`reactive`的区别也可从源码看出来：`ref`是简化版`reactive`，指定了指定了value这个成员属性，
reactive则是利用proxy完成对object的代理

### Renderer渲染

- 在`effectWatch`里被收集依赖，state改变会触发re-render
- 分mount和update两个阶段，用isMounted标记
- 围绕vnode的3个点来渲染：标签名tag、属性props、子节点props

#### mount阶段

- 参数为vnode何container dom
- 记录prevSubTree，之后的每次update都会更新prevSubTree，prevSubTree就是下次diff中的old vnode
- 将真实dom添加到vnode的el属性上，注意update阶段的el就是这里添加的
- 判断children为string还是array，string就`createTextNode`并`append`，array就遍历递归
- 最后把整颗dom树`append`到container

#### update阶段

diff算法思路：

1. tag不同直接`replaceWith`替换
2. 判断props：1. 新比旧多key或者新旧key相同但value不同 2. 旧比新多key
3. 判断children：
   1. newChildren -> string  (oldChildren -> string  oldChildren -> array)
   2. newChildren -> array  (oldChildren -> string  oldChildren -> array)
