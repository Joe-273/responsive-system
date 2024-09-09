// 监听数据的读写
// - 获取属性：读取
// - 设置属性：写入
// - 新增属性：写入
// - 删除属性：写入
// - 是否存在某个属性：读取
// - 遍历属性：读取

import { effect } from "./effect/effect.js";
import reactive from "./reactive.js"

// 拦截后的处理
// - 收集器
// - 触发器
const obj = {
  a: 1,
  b: 2,
  c: {
    name: "张三",
    age: "18",
  }
}
const state = reactive(obj)

effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数1");
  effect(() => {
    console.log(state.c);
    console.log("执行了函数2");
  });
});


console.log("------------------------------");
state.a = 100
