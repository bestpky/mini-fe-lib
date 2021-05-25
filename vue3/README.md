# Vue 3简单实现

```shell
yarn global add http-server
http-server
```

## 实现

- 省略了 Compiler 编译模块，直接写render函数
- 分mount和update两个阶段
- 首次mount后会记录prevSubTree，update阶段使用
- effectWatch收集依赖：把函数赋值给一个全局变量，再执行这个函数，这个函数中如果包含对
响应式对象的get操作，会触发getter()对依赖的收集
- ref和reactive的区别也可从源码看出来：ref是简化版reactive，指定了指定了value这个成员属性，
reactive则是利用proxy完成对object的代理，可以object的key为触发桥梁
