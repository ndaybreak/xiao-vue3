function test() {
  const readline = require('readline')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let firstStr = ''
  rl.on('line', function (line: string) {
    if (!firstStr) {
      firstStr = line
    } else {
      let indx = 0
      for (let i = 0, len = firstStr.length; i < len; i++) {
        const position = line.slice(indx).indexOf(firstStr[i])
        if (position > -1) {
          indx = indx + position + 1
        } else {
          console.log(-1)
          firstStr = ''
          return -1
        }
      }
      firstStr = ''
      console.log(indx - 1)
      return indx - 1
    }
  })
}

test()
