// 给定一个共有 n
//  阶的楼梯，你每步可以上
//  1阶或者 2
//  阶，但不能连续两轮跳
//  阶，请问有多少种方案可以爬到楼顶？

function climbingStairs(n: number) {
  if (n === 1 || n === 2) {
    return 1
  }
  const dp: any = new Array({ length: n + 1 }, () => new Array(3))
  dp[1][1] = 1
  dp[1][2] = 0
  dp[2][1] = 0
  dp[2][2] = 1
  for (let i = 3; i <= n; i++) {
    dp[i][1] = dp[i - 1][2]
    dp[i][2] = dp[i - 2][1] + dp[i - 2][2]
  }
  return dp[n][1] + dp[n][2]
}

console.log(climbingStairs(3))

//  给定一个nxm的二维网格 grid ，网格中的每个单元格包含一个非负整数，表示该单元格的代价。
// 机器人以左上角单元格为起始点，每次只能向下或者向右移动一步，直至到达右下角单元格。请返回从左上角到右下角的最小路径和。
// 第一步：思考每轮的决策，定义状态，从而得到 dp 表
// 第二步：找出最优子结构，进而推导出状态转移方程
// 第三步：确定边界条件和状态转移顺序
function minPath(grid: any, mem: any, i: number, j: number) {
  if (i === 0 && j === 0) {
    return grid[0][0]
  }
  if (i < 0 || j < 0) {
    return Infinity
  }
  if (mem[i][j] !== -1) {
    return mem[i][j]
  }
  const up = minPath(grid, mem, i - 1, j)
  const left = minPath(grid, mem, i, j - 1)
  mem[i][j] = Math.min(left, up) + grid[i][j]
  return mem[i][j]
}
