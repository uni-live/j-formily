import { isObject } from './is.js'

let globPrefix = 'j-custom'

export function uuId(prefix = globPrefix) {
  const time = Date.now()
  const random = Math.floor(Math.random() * 1000000000)
  return prefix + random + String(time) + '__'
}

const test = /^j-custom\d{22}__/g
export function objectToArray(data, reg = test) {
  if (!isObject(data)) return
  const keyForm = new Set()
  for (let key of Object.keys(data)) {
    if (reg.test(key)) {
      const str = key.split('__')
      keyForm.add(str[0])
    }
  }

  const arr = []
  for (let [index, item] of new Map(
    Array.from(keyForm).map((item, index) => [index, item])
  )) {
    arr.push({})
    for (let key of Object.keys(data)) {
      if (key.includes(item)) {
        const str = key.split('__')
        arr[index][str[1]] = data[key]
      }
    }
  }
  return arr
}
