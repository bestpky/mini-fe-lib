# react-fiber 简单实现

react fiber 架构是我见过的最巧妙也是最难的架构，简直 yyds

## 测试

```shell
yarn
yarn run webpack
```

浏览器打开 index.html

## 实现思路

参考源码，架构分为 scheduler（调度器）、reconclier（协调器）、renderer（渲染器）三块

### 几个全局变量

`nextUnitOfWork` 下一个任务单元，指 fiber 节点，用于记录中断前执行到哪个节点
`workInProgressRoot` 保存当前进度的树，用于 commit
`currentRoot` 记录上一次 commit 后的根节点
`deletions` 这次更新要删除的节点

### 对 Class 组件的处理

转成函数组件

### scheduler（调度器）

首先会调用`requestIdleCallback`开启无限循环，每次循环会做两件事：

1. 先判断如果有剩余时间并且有`nextUnitOfWork`，则去跑下个任务，称这个阶段为可中断的 reconcile 阶段
2. 如果没有`nextUnitOfWork`了，进入 commit 阶段，也就是 renderer 调用浏览器 api 操作 dom 的阶段

### reconclier（协调器）

1. 深度优先遍历
2. diff 会区分是否函数组件，函数组件会初始化 useState 变量

#### 双缓存 Fiber 树

在 React 中最多会同时存在两棵 Fiber 树。当前屏幕上显示内容对应的 Fiber 树称为 current Fiber 树，正在内存中构建的 Fiber 树称为 workInProgress Fiber 树

```javascript
currentFiber.alternate === workInProgressFiber
workInProgressFiber.alternate === currentFiber
```

### renderer（渲染器）

操作类型：MOUNT | UPDATE | DELETION

### useState
