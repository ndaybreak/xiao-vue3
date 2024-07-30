function getMaxSubLen(str1, str2) {
  let max = 0
  const arr = []
  for (let i = 0, len1 = str1.length; i < len1; i++) {
    const vLine = []
    arr.push(vLine)
    for (let j = 0, len2 = str2.length; j < len2; j++) {
      if (str1.charAt(i) !== str2.charAt(j)) {
        vLine.push(0)
      } else {
        const val = (i === 0 || j === 0 ? 0 : arr[i - 1][j - 1]) + 1
        vLine.push(val)
        max = Math.max(max, val)
      }
    }
  }
  return max
}

getMaxSubLen('ABCDE', 'BCDg')
