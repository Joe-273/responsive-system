/**
 * 用于记录当前活动的 effect
 */
export let activeEffect = undefined;
// 用来存储对象和其属性的依赖关系
export const targetMap = new WeakMap();
// 模拟函数栈的执行
const effectStack = [];

/**
 * 该函数的作用，是执行传入的函数，并且在执行的过程中，收集依赖
 * @param {*} fn 要执行的函数
 */
export function effect(fn, options = {}) {
  const { lazy = false } = options;
  // 创建一个环境函数，保存保存依赖和重建依赖所需的环境
  const environment = () => {
    try {
      activeEffect = environment;
      effectStack.push(environment);
      cleanup(environment);
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  environment.deps = [];
  environment.options = options;
  if (!lazy) {
    environment();
  }
  return environment;
}

export function cleanup(environment) {
  let deps = environment.deps; // 拿到当前环境函数的依赖（是个数组）
  if (deps.length) {
    deps.forEach((dep) => {
      // 删除每个依赖集合中的当前依赖函数
      dep.delete(environment);
    });
    deps.length = 0;
  }
}
