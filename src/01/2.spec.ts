import {
  assertThat,
  equalTo,
} from 'hamjest';

import { readFileSync } from 'fs' 

const pair = <T>(values: T[]) => {
  return values.map((value, index) => {
    return [value, values[index + 1]]
  }).slice(0, -1)
}


const combine = <T>(items: number, values: T[], result: T[][] = []): T[][] => {
  const [first, ...rest] = values
  const tuple = values.slice(0, items)
  if (tuple.length === items) {
    return combine(items, rest, [...result, tuple])
  } else {
    return result
  }
}


const countDecreasing = (sonarValues: number[]) => {
  const values = combine(3, sonarValues)
    .map((tuples) => tuples.reduce((result, item) => result + item))
    
  return pair(values)
    .filter(([current, next]) => current < next)
    .length
}

describe('Day 1/2', () => {
  it('when values increase returns increased values', () => {
    assertThat(countDecreasing([ 98, 99, 99, 100, 100, 100 ]), equalTo(3));
  })

  it('result', () => {
    const contents = readFileSync('./src/01/input.txt')
    const sonarValues = contents.toString().split('\n').map((number) => parseInt(number))
    
    console.log(countDecreasing(sonarValues))
  })
})

