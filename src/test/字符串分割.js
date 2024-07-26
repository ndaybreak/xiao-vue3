// eslint-disable-next-line no-unused-vars
function test(count, str) {
  const startIndx = str.indexOf('-') + 1
  const realStr = str.substring(startIndx).replaceAll('-', '')
  const len = realStr.length
  let index = 0
  const upperReg = /[A-Z]/g
  const lowerReg = /[a-z]/g
  const result = []
  while (index < len) {
    const currStr = realStr.substring(index, index + count)
    const upperList = currStr.match(upperReg)
    const upperCount = upperList ? upperList.length : 0
    const lowerList = currStr.match(lowerReg)
    const lowerCount = lowerList ? lowerList.length : 0
    if (upperCount > lowerCount) {
      result.push(currStr.toUpperCase())
    } else if (upperCount < lowerCount) {
      result.push(currStr.toLowerCase())
    } else {
      result.push(currStr)
    }
    index += count
  }
  return str.substring(0, startIndx) + result.join('-')
}
