# mini-webpack

## 流程

1. `fs.readFileSync`读取入口文件，`@babel/parser`的`transformFromAst`方法将文件内容转为AST抽象语法树
2. 找出依赖：`@babel/traverse`根据ast和入口文件路径，得到依赖映射表
3. ast转成code，由`@babel/core`、`@babel/preset-env`完成
4. 递归所有依赖文件，生成文件名依赖映射表
5. 插入模板里，写文件
