class Vue{
    constructor(options = {}){
        this.$el = document.querySelector(options.el);
        this.data = options.data; 
        // 代理data，使其能直接this.xxx的方式访问data，正常的话需要this.data.xxx
        Object.keys(options.data).forEach((key)=> {
            this.proxyData(key);
        });
        this.methods = options.methods // 事件方法
        this.watcherTask = {}; // 需要监听的任务列表
        this.observer(); // 初始化劫持监听所有数据
        this.compile(this.$el); // 解析dom
    }
    proxyData(key){
        let that = this;
        Object.defineProperty(that, key, {
            configurable: false,
            enumerable: true,
            get () {
                return that.data[key];
            },
            set (newVal) {
                that.data[key] = newVal;
            }
        });
    }
    observer(){
        let that = this
        Object.keys(this.data).forEach(key=>{
            let value = this.data[key]
            this.watcherTask[key] = []
            Object.defineProperty(this.data,key,{
                configurable: false,
                enumerable: true,
                get(){
                    return value
                },
                set(newValue){
                    if(newValue !== value){
                        value = newValue
                        that.watcherTask[key].forEach(task => {
                            task.update()
                        })
                    }
                }
            })
        })
    }
    compile(el){
        var nodes = el.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(node.nodeType === 3){
                // 文本节点
                var text = node.textContent.trim();
                if (!text) continue;
                this.compileText(node,'textContent')                
            }else if(node.nodeType === 1){
                if(node.childNodes.length > 0){
                    this.compile(node)
                }
                if(node.hasAttribute('v-model') && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')){
                    node.addEventListener('input',(()=>{
                        // 这里用自执行是因为要先把data初始化到视图上
                        let attrVal = node.getAttribute('v-model')
                        this.watcherTask[attrVal].push(new Watcher(node,this,attrVal,'value'))
                        node.removeAttribute('v-model')
                        return () => {
                            this.data[attrVal] = node.value
                        }
                    })())
                }
                if(node.hasAttribute('v-html')){
                    let attrVal = node.getAttribute('v-html');
                    this.watcherTask[attrVal].push(new Watcher(node,this,attrVal,'innerHTML'))
                    node.removeAttribute('v-html')
                }
                if(node.hasAttribute('@click')){
                    let attrVal = node.getAttribute('@click')
                    node.removeAttribute('@click')
                    node.addEventListener('click',e => {
                        this.methods[attrVal] && this.methods[attrVal].call(this, e)
                    })
                }
            }
        }
    }
    compileText(node,type){
        let reg = /\{\{(.*?)\}\}/g, txt = node.textContent;
        if(reg.test(txt)){
            node.textContent = txt.replace(reg,(matched,value)=>{
                value = value.trim()
                let tpl = this.watcherTask[value] || []
                tpl.push(new Watcher(node,this,value,type))
                return this[value]
            })
        }
    }
}

class Watcher{
    constructor(el,vm,value,type){
        this.el = el;
        this.vm = vm;
        this.value = value;
        this.type = type;
        // 相当于mount的时候初始化
        this.update()
    }
    update(){ 
        // 将data的某个key的值和视图的某个节点绑定，并提供更新方法    
        // type描述如何更新节点，枚举为dom的属性或方法，如innerHtml等
        this.el[this.type] = this.vm.data[this.value]
    }
}