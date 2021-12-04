import {
  assertThat,
  equalTo,
  falsey,
  falsy,
  string,
  truthy,
} from 'hamjest';

import { readFileSync } from 'fs' 

type Mode = 'mostCommon' | 'leastCommon';

const convertToDecimal = (number: string) => 
  parseInt(number, 2)

const convertToBits = (binaryNumbers: string[]) => 
  binaryNumbers[0].split('').map((_, pos) =>
    binaryNumbers.reduce((a, bNumber) => a + parseInt(bNumber[pos]), 0))

const convertBitsToGamma = (halfCount: number, bits: number[]) => 
  convertToDecimal(bits.map(bit => bit >= halfCount ? '1' : '0').join(''))

const convertBitsToEpsilon = (halfCount: number, bits: number[]) => 
  convertToDecimal(bits.map(bit => bit < halfCount ? '1' : '0').join(''))

const calculatePowerConsumption = (binaryNumbers: string[]) => {
  const halfCount = binaryNumbers.length / 2;
  const bits = convertToBits(binaryNumbers)

  const gamma = convertBitsToGamma(halfCount, bits);
  const epsilon = convertBitsToEpsilon(halfCount, bits);

  return gamma * epsilon;
}

const calculateCO2 = (binaryNumbers: string[]) => {
  const oxygenRating = getRating(binaryNumbers, 'mostCommon');
  const co2Rating = getRating(binaryNumbers, 'leastCommon');

  return oxygenRating * co2Rating;
}

const getRating = (binaryNumbers: string[], mode: Mode): number => {
  for (let pos = 0; pos < binaryNumbers[0].length; pos++) {
      binaryNumbers = filter(binaryNumbers, pos, mode);
      if (binaryNumbers.length === 1) { break; }
  }

  return convertToDecimal(binaryNumbers[0]);
}


const filter = (binaryNumbers: string[], position: number, mode: Mode): string[] => {
  const bitCount = binaryNumbers.reduce((a, x) => a + parseInt(x[position]), 0);
  const keepBit = (bitCount >= binaryNumbers.length / 2) !== (mode === 'leastCommon') ? '1' : '0';

  return binaryNumbers.filter(number => number[position] === keepBit);
}


describe('Day 3/1', () => {
  it('part 1', () => {
    const contents = readFileSync('./src/03/input.txt')
    const inputs = contents.toString().split('\n')
      
    assertThat(calculatePowerConsumption(inputs), equalTo(2967914))
  })

  it('part 2', () => {
    const contents = readFileSync('./src/03/input.txt')
    const inputs = contents.toString().split('\n')
      
    assertThat(calculateCO2(inputs), equalTo(7041258))
  })
})

