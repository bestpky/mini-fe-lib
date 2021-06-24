const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const options = require('./webpack.config')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')


const parserUtil =  {
    getAST: path => {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8')
        // 将文件内容转为AST抽象语法树
        return parser.parse(content, {
            sourceType: 'module'
        })
    },
    // 找出依赖
    getDependecies: (ast, filename) => {
        const dependecies = {}
        // 遍历所有的import 模块，存入dependecies
        traverse(ast, {
            // 类型为ImportDeclaration的ast节点就是import语句
            ImportDeclaration({ node }) {
                const dirname = path.dirname(filename)
                // 保存依赖模块路径，之后生成依赖关系图需要用到
                const filepath = './' + path.join(dirname, node.source.value)

                dependecies[node.source.value] = filepath
            }
        })

        return dependecies
    },
    // 从ast转换为code
    getCode: ast => {
        // ast转换为code
        const { code } = transformFromAst(ast, null, {
            // @ts-ignore
            presets: ['@babel/preset-env']
        })
        return code
    }
}


class Compiler {
    constructor(options) {
        const { entry, output } = options
        this.entry = entry
        this.output = output
    }

    run() {
        // 解析入口文件
        const info = this.build(this.entry)
        const modules = []
        modules.push(info)
        modules.forEach(({dependecies}) => {
            // 判断有依赖对象，递归解析所有依赖项
            if(dependecies) {
                for(const dependency in dependecies) {
                    modules.push(this.build(dependecies[dependency]))
                }
            }
        })

        // 生成依赖图
        const dependencyGraph = modules.reduce(
            (graph, item) => ({
                ...graph,
                // 使用文件路径作为每个模块的唯一标识符，保存对应模块的依赖对象和文件内容
                [item.filename]: {
                    dependecies: item.dependecies,
                    code: item.code
                }
            }),
            {}
        )

        this.generator(dependencyGraph)
    }

    // 构建启动
    build(filename) {
        const {getAST, getDependecies, getCode} = parserUtil
        const ast = getAST(filename)
        const dependecies = getDependecies(ast, filename)
        const code = getCode(ast)

        return {
            // 文件路径，可以作为每个模块的唯一标识符
            filename,
            // 依赖对象，保存着依赖模块路径
            dependecies,
            // 文件内容
            code
        }
    }

    // 重写require函数(因为浏览器无法识别commonjs语法)，输出Bundle
    generator(graph) {
        try {
            fs.statSync(this.output.path);
        } catch(err) {
            // 路径不存在
            fs.mkdirSync(this.output.path)
        }
        // 输出文件路径
        const filePath = path.join(this.output.path, this.output.filename)
        const bundle = `(function(graph){
            //require函数的本质是执行一个模块的代码，然后将相应变量挂载到exports对象上
            function require(module){
                //localRequire的本质是拿到依赖包的exports变量
                function localRequire(relativePath){
                    return require(graph[module].dependecies[relativePath])
                }
                var exports = {};
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,graph[module].code);
                //函数返回指向局部变量，形成闭包，exports变量在函数执行后不会被摧毁
                return exports;
            }
            require('${this.entry}')
        })(${JSON.stringify(graph)})`

        // 把文件写入到文件系统
        fs.writeFileSync(filePath, bundle, 'utf-8')
        
    }
}

new Compiler(options).run()
