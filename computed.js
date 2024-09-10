import { effect } from "./effect/effect.js"
import { track, TrackOpTypes } from "./effect/track.js"
import { trigger, TriggerOpTypes } from "./effect/trigger.js"

function _normalize(getterOrOptions) {
  let getter, setter

  if (typeof getterOrOptions === 'function') {
    getter = getterOrOptions
    setter = function () {
      // 如果没有传入setter就设置值，发出警告
      console.warn("it has no setter function")
    }
  } else {
    // 传入了一个对象
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return { getter, setter }

}


export function computed(getterOrOptions) {
  // 解构出归一化的getter和setter 
  const { getter, setter } = _normalize(getterOrOptions)

  let value
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      // 数据变化，重新执行computed，重新执行依赖函数
      dirty = true
      trigger(computedObject, TriggerOpTypes.SET, "value")
    }
  })

  const computedObject = {
    get value() {
      // 读取computed属性的时候收集依赖
      track(computedObject, TrackOpTypes.GET, "value")
      if (dirty) {
        value = effectFn()
        dirty = false
      }

      return value
    },
    set value(value) {
      setter(value)
    },
  }
  return computedObject
}
