import { track, TrackOpTypes } from "../../effect/track.js"

export default function (target, key) {
  const result = Reflect.has(target, key)

  track(target, TrackOpTypes.HAS, key)

  return result
}
