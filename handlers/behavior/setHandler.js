import { trigger, TriggerOpTypes } from "../../effect/trigger.js"
import { hasChange } from "../../utils.js"


export default function (target, key, value) {
  //保存旧的值 
  const oldValue = target[key]
  // 判断是否是 add 操作
  const triggerType = target.hasOwnProperty(key) ? TriggerOpTypes.SET : TriggerOpTypes.ADD
  // 缓存数组长度
  const oldLength = Array.isArray(target) ? target.length : undefined

  const result = Reflect.set(target, key, value)
  if (hasChange(oldValue, value)) {
    trigger(target, triggerType, key, value)
  }

  // 数组 length 改变的情况
  if (Array.isArray(target)) {
    if (oldLength !== result.length) {
      if (key !== "length") {
        // length 隐式变换: 要触发 length 的 set 行为
        trigger(target, TriggerOpTypes.SET, "length", result.length)
      } else {
        // length 显式变换: 如果变换的 length 小于原来的 length,触发target的 delete 行为
        if (oldLength > target.length) {
          for (let i = target.length; i < oldLength; i++) {
            trigger(target, TriggerOpTypes.DELETE, i.toString())
          }
        }
      }
    }
  }

  return result
}
