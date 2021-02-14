const getTag = (vDom) => {
  if (typeof vDom.type === 'string') {
    return 'host_component'
  }
}
export default getTag
