import {
  assertThat,
  equalTo,
} from 'hamjest';

import { readFileSync } from 'fs' 

class State<T> {
  static of<T>(state: T) {
    return new State(state)
  }
  constructor(private state: T) {}

  bind<I>(fn: (state: T) => I): State<I> {
    return State.of(fn(this.state))
  }
}


type Submarine = {
  horizontalPosition: number,
  depth: number
  aim: number
}

const createSubmarine = (): Submarine => {
  return {
    horizontalPosition: 0,
    depth: 0,
    aim: 0
  }
}

const moveForward = (movement: number) => (submarine: Submarine): Submarine => {
  return { 
    ...submarine, 
    horizontalPosition: submarine.horizontalPosition + movement,
    depth: submarine.depth + (submarine.aim * movement)
  }
}

const moveDown = (movement: number) => (submarine: Submarine): Submarine => {
  return { 
    ...submarine, 
    aim: submarine.aim + movement,
  }
}

const moveUp = (movement: number) => (submarine: Submarine): Submarine => {
  return { 
    ...submarine, 
    aim: submarine.aim - movement
  }
}

const calculatePosition = (submarine: Submarine) => {
  return submarine.depth * submarine.horizontalPosition
}


const mapCommandToAction = (command: string) => {
  if (command === 'forward') {
    return moveForward
  } else if (command === 'down') {
    return moveDown
  } else if (command === 'up') {
    return moveUp
  }
  throw new Error('Unknown command')
}

describe('Day 2/1', () => {
  
  it('moving down 5, forward 8 depth increases', () => {
    State.of(createSubmarine())
      .bind(moveForward(5))
      .bind(moveDown(5))
      .bind(moveForward(8))
      .bind(moveUp(3))
      .bind(moveUp(8))
      .bind(moveForward(2))
      .bind(calculatePosition)
      .bind((position) => assertThat(position, equalTo(420)))
  })

  it('result', () => {
    const contents = readFileSync('./src/02/input.txt')
    const submarineState = contents.toString().split('\n')
      .map((line) => {
        const [command, amount] = line.split(" ")
        return mapCommandToAction(command)(parseInt(amount))
      })
      .reduce((result, action) => {
        return result.bind(action)
      }, State.of(createSubmarine()))

    submarineState.bind(calculatePosition).bind((position) => {
      console.log(position)
    })
  })
})

