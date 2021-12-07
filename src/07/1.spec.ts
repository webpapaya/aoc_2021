import { readFileSync } from 'fs' 
import { assertThat, equalTo } from 'hamjest'

const range = (from: number, to: number) => {
  return Array.from({ length: to - from }).map((_, index) => index + from)
}

const median = (numbers: number[]) => {
  const middle = Math.floor(numbers.length/2)
  return [...numbers].sort((a, b) => a - b)[middle]
}

const part1 = (crabs: number[]) => {
  const targetPosition = median(crabs)
  return crabs
    .map((position)=> Math.abs(targetPosition - position))
    .reduce((sum, item) => sum + item, 0)
}

const part2 = (crabs: number[]) => {
  const lowest = Math.min(...crabs);
  const highest = Math.max(...crabs);
  const fuel = range(lowest, highest).map((depth) => {
    return crabs.reduce((fuel, crab) => {
      const n = Math.abs(crab - depth)
      return fuel+(n*(n+1))/2 
    }, 0)
  })
  return Math.min(...fuel);
}


describe.only('Day 7', () => {
  it('calculate median', () => {
    assertThat(median([1,3,2]), equalTo(2))
  })
  it('calculate part1 with test data', () => {
    assertThat(part1([16,1,2,0,4,2,7,1,2,14]), equalTo(37))
  })
  it('calculate part2 with test data', () => {
    assertThat(part2([16,1,2,0,4,2,7,1,2,14]), equalTo(168))
  })
  it('part 1', () => {
    const contents = readFileSync('./src/07/input.txt')
    const timesToReproduce = contents.toString().split(',').map((number) => parseInt(number))
  
    console.log(part1(timesToReproduce))
  })
  it('part 2', () => {
    const contents = readFileSync('./src/07/input.txt')
    const timesToReproduce = contents.toString().split(',').map((number) => parseInt(number))
  
    console.log(part2(timesToReproduce))
  })
})

