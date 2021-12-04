import {
  array,
  assertThat,
  equalTo,
  falsy,
  truthy,
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

const updateAt = <T>(position: number, value: T, array: T[]) => {
  if (position === -1) { return array }
  const copy = [...array]
  copy[position] = value
  return copy
}

const removeItems = <T>(arr: Array<T>, items: Array<T>): Array<T> => { 
  return arr.filter((element) => items.indexOf(element) === -1)
}

const lastOf = <T>(arr: Array<T>): T => { 
  return arr[arr.length - 1]
}


type Board = {
  numbers: number[],
  drawnNumbers: (boolean)[],
  size: number,
  latestNumberDrawn?: number
}

const initializeBoard = (numbers: number[]): Board => {
  return {
    numbers,
    drawnNumbers: Array(numbers.length).fill(false),
    size: Math.pow(numbers.length, 1/2)
  }
}

const drawNumber = (number: number) => (board: Board): Board => {
  const index = board.numbers.indexOf(number)
  return {
    ...board,
    drawnNumbers: updateAt(index, true, board.drawnNumbers),
    latestNumberDrawn: number
  }
}

const getIndexOfEachColumn = (board: Board) => {
  return Array.from({ length: board.size }).map((_, rowIdx) => {
    return Array.from({ length: board.size }).map((_, columnIdx) => {
      return columnIdx * board.size + rowIdx
    })
  })
}

const getIndexOfEachRow = (board: Board) => {
  return Array.from({ length: board.size }).map((_, rowIdx) => {
    return Array.from({ length: board.size }).map((_, columnIdx) => {
      return rowIdx * board.size + columnIdx
    })
  })
}

const buildColumnSolver = (columnExtractor: (board: Board) => number[][]) => {
  const didWin = (board: Board, columnsIdxArray = columnExtractor(board)): boolean => {
    if (!columnsIdxArray.length) { return false }
    const [currentColumn, ...remainingColumns] = columnsIdxArray
    return currentColumn.every((idx) => board.drawnNumbers[idx]) || didWin(board, remainingColumns)
  }

  return didWin
}

const didColumnWin = buildColumnSolver(getIndexOfEachColumn)
const didRowWin = buildColumnSolver(getIndexOfEachRow)

const isVictory = (board: Board) => 
  didRowWin(board) || didColumnWin(board)

const getScore = (board: Board) => {
  if (!board.latestNumberDrawn) { return }
  const sumOfUndrawnNumbers = board.drawnNumbers
    .map((value, idx) => value ? -1 : idx)
    .filter((value) => value !== -1)
    .map((idx) => board.numbers[idx])
    .reduce((result, item) => result + item, 0)

  return sumOfUndrawnNumbers * board.latestNumberDrawn
}

const solve1 = (boards: Board[], drawnNumbers: number[]): number | undefined => {
  if (!drawnNumbers.length) { throw Error('No board won') }
  const [currentNumber, ...remainingNumbers] = drawnNumbers
  const updatedBoards = boards.map(drawNumber(currentNumber))
  const victoryBoard = updatedBoards.find(isVictory)

  return victoryBoard
    ? getScore(victoryBoard)
    : solve1(updatedBoards, remainingNumbers)
}

const solve2 = (boards: Board[], drawnNumbers: number[], lastVictoryBoard?: Board): number | undefined => {
  if (!drawnNumbers.length) {
    return getScore(lastVictoryBoard!)
  }

  const [currentNumber, ...remainingNumbers] = drawnNumbers
  const updatedBoards = boards.map(drawNumber(currentNumber))
  const boardsWithVictory = updatedBoards.filter(isVictory)
  const boardsNoVictory = removeItems(updatedBoards, boardsWithVictory)
  const updatedLastVictoryBoard = lastOf(boardsWithVictory) || lastVictoryBoard

  return solve2(boardsNoVictory, remainingNumbers, updatedLastVictoryBoard)
}


describe('Day 4/1', () => {
  it('when a board has 1 number, AND this number is drawn, isVictory returns true', () => {
    State.of(initializeBoard([1]))
      .bind(drawNumber(1))
      .bind(isVictory)
      .bind((result) => assertThat(result, truthy()))
  })

  it('when a board has 4 number, AND one of these numbers is drawn, isVictory returns false', () => {
    State.of(initializeBoard([1, 2, 3, 4]))
      .bind(drawNumber(1))
      .bind(isVictory)
      .bind((result) => assertThat(result, falsy()))
  })

  it('when a board has 4 number, AND one row of these numbers is drawn, isVictory returns true', () => {
    State.of(initializeBoard([1, 2, 3, 4]))
      .bind(drawNumber(1))
      .bind(drawNumber(2))
      .bind(isVictory)
      .bind((result) => assertThat(result, truthy()))
  })

  it('when a board has 4 number, AND one column of these numbers is drawn, isVictory returns true', () => {
    State.of(initializeBoard([1, 2, 3, 4]))
      .bind(drawNumber(1))
      .bind(drawNumber(3))
      .bind(isVictory)
      .bind((result) => assertThat(result, truthy()))
  })

  it('when a column is drawn, this column is not summed', () => {
    State.of(initializeBoard([1, 2, 3, 4]))
      .bind(drawNumber(1))
      .bind(getScore)
      .bind((result) => assertThat(result, equalTo(9)))
  })
  
  it('part 1', () => {
    const contents = readFileSync('./src/04/input.txt')
    let [rawDrawnNumbers, ...rawBoards] = contents.toString().split('\n\n')
    const drawnNumbers = rawDrawnNumbers.split(",").map((number) => parseInt(number))
    const boards = rawBoards.map((rawBoard) => initializeBoard(rawBoard
      .replace(/\n/g, " ")
      .split(" ")
      .filter((val) => val)
      .map((val) => parseInt(val))))
    
    console.log(solve1(boards, drawnNumbers))
  })

  it('part 2', () => {
    const contents = readFileSync('./src/04/input.txt')
    let [rawDrawnNumbers, ...rawBoards] = contents.toString().split('\n\n')
    const drawnNumbers = rawDrawnNumbers.split(",").map((number) => parseInt(number))
    const boards = rawBoards.map((rawBoard) => initializeBoard(rawBoard
      .replace(/\n/g, " ")
      .split(" ")
      .filter((val) => val)
      .map((val) => parseInt(val))))
    
    console.log(solve2(boards, drawnNumbers))
  })
})

