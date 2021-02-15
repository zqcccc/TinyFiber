import { Component } from '../../Component'

const getTag = (vDom) => {
  if (typeof vDom.type === 'string') {
    return 'host_component'
  } else if (Object.getPrototypeOf(vDom.type) === Component) {
    return 'class_component'
  } else {
    return 'function_component'
  }
}
export default getTag
