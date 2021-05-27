# Vue2 MVVM

## 实现思路

不涉及虚拟dom和diff算法，在实例化Vue时做这几件事:

1. Object.defineProperty代理data到this

2. 遍历data的key：初始化watcherTask[key] = []，Object.defineProperty的set()里
遍历执行watcherTask[key]

3. 解析dom树（收集依赖）：遍历el.childNodes，根据nodeType判断子节点是否文本节点：
    1. 文本节点：正则匹配{{key}}，replace方法里watcherTask[key].push(new Watcher(...))，并返回this[key]

    2. 非文本节点：
        1. 有子节点递归

        2. 无子节点，hasAttribute检查v-model等指令,同样设置更新函数，具体看代码
