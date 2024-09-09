import { track, TrackOpTypes } from "../../effect/track.js"

export default function (target) {
  const result = Reflect.ownKeys(target)
  track(target, TrackOpTypes.ITERATE)
  return result
}
