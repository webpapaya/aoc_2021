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

const countDecreasing = (sonarValues: number[]) => {
  return pair(sonarValues)
    .filter(([current, next]) => current < next)
    .length
}

describe('Day 1/1', () => {
  it('2 decreasing numbers return 1', () => {
    assertThat(countDecreasing([ 99, 100 ]), equalTo(1));
  })
  
  
  it('3 decreasing numbers return 2', () => {
    assertThat(countDecreasing([ 98, 99, 100 ]), equalTo(2));
  })
  
  it('1 increasing, 1 decreasing number return 1', () => {
    assertThat(countDecreasing([ 100, 101, 98 ]), equalTo(1));
  })
  
  it('result', () => {
    const contents = readFileSync('./src/01/input.txt')
    const sonarValues = contents.toString().split('\n').map((number) => parseInt(number))
    
    console.log(countDecreasing(sonarValues))
  })
})

