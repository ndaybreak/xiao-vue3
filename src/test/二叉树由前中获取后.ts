function endLoop(data: any) {
  const result: any[] = []
  data.left && result.push(...endLoop(data.left))
  data.right && result.push(...endLoop(data.right))
  result.push(data.value)
  return result
}

const testData1 = {
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

// console.log(endLoop(testData1))

interface INode {
  value: string
  left?: INode
  right?: INode
}
function getNode(frontList: string[], midList: string[]) {
  const root = frontList[0]
  const obj: INode = { value: root }
  const divideIndx = midList.findIndex((val) => val === root)
  const midLeftNodes = midList.slice(0, divideIndx)
  const midRightNodes = midList.slice(divideIndx + 1)
  const frontRightNodes: string[] = []
  const frontLeftNodes = frontList.slice(1).reduce((prev, curr) => {
    if (midLeftNodes.includes(curr)) {
      prev.push(curr)
    } else {
      frontRightNodes.push(curr)
    }
    return prev
  }, [] as any)
  obj.left = frontLeftNodes.length ? getNode(frontLeftNodes, midLeftNodes) : undefined
  obj.right = frontRightNodes.length ? getNode(frontRightNodes, midRightNodes) : undefined
  return obj
}

const o = getNode(['a', 'c', 'f', 'g', 'b', 'd', 'e'], ['f', 'c', 'g', 'a', 'd', 'b', 'e'])

console.log(endLoop(o))
