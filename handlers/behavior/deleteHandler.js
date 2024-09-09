import { trigger, TriggerOpTypes } from "../../effect/trigger.js"

export default function (target, key) {
  const result = Reflect.deleteProperty(target, key)

  // 判断是否需要派发更新
  // 如果删除成功, 原本有这个 key 
  if (result && target[key])
    trigger(target, TriggerOpTypes.DELETE, key)

  return result
}



