import { pauseTrack, RAW, resumTrack, track, TrackOpTypes } from "../../effect/track.js"
import reactive from "../../reactive.js"
import { isObject } from "../../utils.js"

const arrRewriteFunction = {} // 保存数组函数的对象

// 重写方法，能够查找原始对象
const toRewriteFunctionList = ["indexOf", "lastIndexOf", "includes"]
toRewriteFunctionList.forEach(i => {
  arrRewriteFunction[i] = function (...args) {
    const result = Array.prototype[i].apply(this, args);

    if (result === false || result < 0) {
      // 如果原本的方法没有找到 
      return Array.prototype[i].apply(this[RAW], args)
    }

    return result
  }
})

// 不需要收集依赖的数组方法
const toPauseTrackFunctionList = ["push", "pop", "shift", "unshift", "splice"]
toPauseTrackFunctionList.forEach(i => {
  arrRewriteFunction[i] = function (...args) {
    pauseTrack()
    const result = Array.prototype[i].apply(this, args)
    resumTrack()
    return result
  }
})

export default function (target, key) {
  const result = Reflect.get(target, key)

  //  如果 key 为 RAW 则访问原始对象
  if (key === RAW) {
    return target
  }


  // 收集依赖
  track(target, TrackOpTypes.GET, key)

  // 如果是访问数组的一些方法，则使用重写的方法
  if (arrRewriteFunction.hasOwnProperty(key) && Array.isArray(target)) {
    return arrRewriteFunction[key]
  }


  // 如果个对象，递归处理
  if (isObject(result)) {
    return reactive(result)
  }

  return result

}
