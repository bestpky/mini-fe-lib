import { effectWatch, reactive } from "./core/reactivity/index.js";
import { h } from "./core/h.js";

// v1
// let a = 10;
// let b = a + 10;
// console.log(b)

// a = 20;
// b = a + 10;
// console.log(b)

// v2

// let a = 10;
// let b;
// update();
// function update() {
//   b = a + 10;
//   console.log(b);
// }

// a = 20;
// update();

// v3
// a 发生变更了 ，我想让 b 自动更新

// 声明一个响应式对象
// let a = reactive({
//   value: 1,
// });
// let b;
// effectWatch(() => {
//   // 函数
//   // 1. 会执行以下
//   b = a.value + 10;
//   console.log(b);
// });

// // a 响应式对象的值发生改变之后
// a.value = 30;

// vue3

export default {
  // 省略了 template -> render
  render(context) {
    return h(
      "div",
      {
        id: "app - " + context.state.count,
        class: "showTim",
      },
      // String(context.state.count)
      [h("p", null, String(context.state.count)), h("p", null, "hahha")]
    );
  },
  setup() {
    // a = 响应式数据
    const state = reactive({
      count: 0,
    });
    setTimeout(() => {
      state.count++
    }, 1000);
    
    return { state };
  },
};
