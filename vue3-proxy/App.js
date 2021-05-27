import { reactive } from "./core/reactivity/index.js";
import { h } from "./core/h.js";

export default {
  render(context) {
    const { pushItem,popItem, state, setState, setFirstItem } = context
    return h(
      "div", {class: "showTime"},
      [
        h('h3', '双向绑定'),
        h('p', state.text),
        h('input', { value: state.text, '@input': (e) => setState('text', e.target.value)}),
        h('hr'),
        h('h3', '数组增删'),
        h('button', { '@click': pushItem }, 'push'),
        h('button', { '@click': popItem }, 'pop'),
        h('input', { placeholder: '下标改第一个元素', '@input': (e) => setFirstItem(e.target.value)}),
        h("ul", state.arr.map(item => h('li', String(item))))
        
      ]
    );
  },
  setup() {
    const state = reactive({
      text: '123',
      arr: [1,2,3]
    });
    function setState(key, value) {
      state[key] = value
    }
    function pushItem() {
      state.arr.push(state.arr.length + 1)
    }
    function popItem() {
      state.arr.pop()
      console.log(state.arr)
    }
    function setFirstItem(v) {
      state.arr[0] = v
    }
    window.state = state // console调试
    return { 
      state,
      setState,
      setFirstItem,
      pushItem,
      popItem,
    };
  },
};
