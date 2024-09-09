// 提供一个reactive API
// 接收一个对象，返回一个 Proxy 对象
import handlers from './handlers/index.js'
export default function (object) {
  return new Proxy(object, handlers)
}
