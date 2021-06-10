# mobx简单实现

> 参考 [实现一个简单的 MobX](https://zhuanlan.zhihu.com/p/265554652)

## Proxy对比Object.defineProperty的好处

1. 直接代理对象而非key，无需遍历每个key
2. 对于不存在但未来会触发setter的属性，也能监听到
3. 天然支持数组方法，无需hack
4. 拦截方式更多，13种
5. 返回新对象而非修改旧对象
6. 浏览器性能红利

## 依赖收集

全局变量currentFn是连接autorun里的函数和发布订阅的桥梁，把当前fn赋值给一个全局变量，然后
执行fn，fn里被observed的obj触发[getter]操作，会使当前fn被添加到订阅，这就是依赖收集

## Object.defineProperty版本

- 用自增的id做发布订阅的key是因为嵌套object的key可能相同
- 小技巧：用Symbol当key来存每层的obj，并且不会被枚举到

## Proxy版本

细节：dfp中能用全局自增id映射到每个key是因为，有遍历和递归的过程，
而在proxy方式中没有遍历只有递归，如果直接用key作为发布订阅的type，那又回到不同层key可能相同的问题
所以使用一个全局的Map来解决，用target作key保证唯一，映射到id也唯一

```js
// Map的结构
const map = {
  [target]: {
    [key]: [id]
  }
}
```
