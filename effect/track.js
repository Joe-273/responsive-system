import { activeEffect, targetMap } from "./effect.js"

let shouldTrack = true

export function pauseTrack() {
  shouldTrack = false
}
export function resumTrack() {
  shouldTrack = true
}
// 收集依赖
export const TrackOpTypes = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate",
}

export const RAW = Symbol("raw")
export const ITERATE_KEY = Symbol("iterate_key")

export function track(target, type, key) {
  if (!shouldTrack || !activeEffect) {
    return;
  }
  // targetMap -> propMap -> typeMap -> depSet
  // 从target对象的映射表中找到属性的映射表（propMap）
  // 再从属性的映射表中找到对应行为类型的映射表（typeMap）
  // 再从对应行为类型的映射表找到保存依赖函数的集合（depSet）
  // 最后将依赖函数保存到行为对应的依赖函数集合中
  let propMap = targetMap.get(target);
  if (!propMap) {
    propMap = new Map();
    targetMap.set(target, propMap);
  }

  // 之前如果是遍历所有的属性， key 会是 undefined
  // 所以对 key 值做一下参数归一化
  if (type === TrackOpTypes.ITERATE) {
    key = ITERATE_KEY;
  }

  let typeMap = propMap.get(key);
  if (!typeMap) {
    typeMap = new Map();
    propMap.set(key, typeMap);
  }

  // 最后一步，根据 type 值去找对应的 Set
  let depSet = typeMap.get(type);
  if (!depSet) {
    depSet = new Set();
    typeMap.set(type, depSet);
  }

  // 现在找到 set 集合了，就可以存储依赖了
  if (!depSet.has(activeEffect)) {
    depSet.add(activeEffect);
    activeEffect.deps.push(depSet); // 将集合存储到 deps 数组里面
  }
}
