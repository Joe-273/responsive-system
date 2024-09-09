// 工具函数
export function isObject(value) {
  return typeof value === 'object' && value !== null
}

export function hasChange(oldValue, newValue) {
  return !Object.is(oldValue, newValue)
}
