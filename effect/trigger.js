import { activeEffect, targetMap } from "./effect.js";
import { ITERATE_KEY, TrackOpTypes } from "./track.js";

// 派发更新
export const TriggerOpTypes = {
  SET: "set",
  ADD: "add",
  DELETE: "delete"
}

// 定义写入行为和读取行为的映射关系
const triggerTypeMap = {
  [TriggerOpTypes.SET]: [TrackOpTypes.GET],
  [TriggerOpTypes.ADD]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
  [TriggerOpTypes.DELETE]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
};

export function trigger(target, type, key) {
  const effectFns = getEffectFns(target, type, key);
  if (!effectFns) return;
  for (const effectFn of effectFns) {
    if (effectFn === activeEffect) continue;
    if (effectFn.options && effectFn.options.scheduler) {
      // 说明用户传递了回调函数，用户期望自己来处理依赖的函数
      effectFn.options.scheduler(effectFn);
    } else {
      // 执行依赖函数
      effectFn();
    }
  }
}

// 获取依赖所有相关函数
function getEffectFns(target, type, key) {
  const propMap = targetMap.get(target);
  if (!propMap) return;

  // 如果是新增或者删除操作，会涉及到额外触发迭代
  const keys = [key];
  if (type === TriggerOpTypes.ADD || type === TriggerOpTypes.DELETE) {
    keys.push(ITERATE_KEY);
  }

  const effectFns = new Set(); // 用于存储依赖的函数

  for (const key of keys) {
    const typeMap = propMap.get(key);
    if (!typeMap) continue;

    const trackTypes = triggerTypeMap[type];
    for (const trackType of trackTypes) {
      const dep = typeMap.get(trackType);
      if (!dep) continue;
      for (const effectFn of dep) {
        effectFns.add(effectFn);
      }
    }
  }
  return effectFns;
}
