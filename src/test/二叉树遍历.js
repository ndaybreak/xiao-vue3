export const testData1 = {
  value: 'D',
  left: {
    value: 'B',
    left: {
      value: 'A'
    },
    right: {
      value: 'C'
    }
  },
  right: {
    value: 'E',
    right: {
      value: 'G',
      left: {
        value: 'F'
      }
    }
  }
}

function preLoop(obj) {
  const result = []
  result.push(obj.value)
  obj.left && result.push(...preLoop(obj.left))
  obj.right && result.push(...preLoop(obj.right))
  return result
}

function midLoop(obj) {
  const result = []
  obj.left && result.push(...midLoop(obj.left))
  result.push(obj.value)
  obj.right && result.push(...midLoop(obj.right))
  return result
}

function nexLoop(obj) {
  const result = []
  obj.left && result.push(...nexLoop(obj.left))
  obj.right && result.push(...nexLoop(obj.right))
  result.push(obj.value)
  return result
}

console.log(preLoop(testData1).join(''))
console.log(midLoop(testData1).join(''))
console.log(nexLoop(testData1).join(''))
