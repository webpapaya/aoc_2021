import { readFileSync } from 'fs' 

const arrayRotate = <T>(arr: T[]) => {
  arr.push(arr.shift()!);
  return arr;
}

const nextDay = (timesToReproduce: number[], iterations: number) => {
    const ages = Array.from({ length: 9 }).map(() => 0)
    timesToReproduce.forEach((age) => {ages[age] = ages[age] + 1 })
    
    for (let i = 0; i < iterations; i ++) {
      ages[7] += ages[0]
      arrayRotate(ages)
    }

    return ages.reduce((a, b) => a + b, 0)
}

const part1 = (timesToReproduce: number[]) => {
  return nextDay(timesToReproduce, 80)
}

const part2 = (timesToReproduce: number[]) => {
  return nextDay(timesToReproduce, 256)
}

describe.only('Day 6', () => {
  it('part 1', () => {
    const contents = readFileSync('./src/06/input.txt')
    const timesToReproduce = contents.toString().split(',').map((number) => parseInt(number))
  
    console.log(part1(timesToReproduce))
  })

  it('part 2', () => {
    const contents = readFileSync('./src/06/input.txt')
    const timesToReproduce = contents.toString().split(',').map((number) => parseInt(number))
  
    console.log(part2(timesToReproduce))
  })
})

