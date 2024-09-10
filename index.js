// 监听数据的读写
// - 获取属性：读取
// - 设置属性：写入
// - 新增属性：写入
// - 删除属性：写入
// - 是否存在某个属性：读取
// - 遍历属性：读取

import { computed } from "./computed.js";
import { effect } from "./effect/effect.js";
import reactive from "./reactive.js"

// 拦截后的处理
// - 收集器
// - 触发器
const state = reactive({
  a: 1,
  b: 2
})

const sum = computed(() => {
  console.log("计算属性重新计算")
  return state.a + state.b
})
// console.log(sum.value)
effect(() => {
  console.log("RANDER函数重新运行", sum.value)
})

state.a = 100

