function climp(n: number) {
  if (n === 1 || n === 2) return n
  const arr = new Array(n).fill(-1)
  arr[1] = 1
  arr[2] = 2
  for (let i = 3; i <= n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2]
  }
  return arr[n]
}

console.log(climp(4))
