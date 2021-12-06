import {
  assertThat,
  containsInAnyOrder,
  equalTo,
} from 'hamjest';

import { readFileSync } from 'fs' 

type Point = [number, number]
type Path = [Point, Point]
type Direction = -1 | 0 | 1

const count = <T>(arr: T[], comparer: (item: T) => string) => {
  return Object.values(arr.reduce((result, item) => {
    const key = comparer(item)
    result[key] = result[key] || {
      item: item,
      count: 0
    }
    result[key].count += 1
    
    return result
  }, {} as { [key in string]: { item: T, count: number } }))
}

const getDelta = (first: number, second: number) => {
  if (first === second) { return 0 }
  return first > second ? -1 : 1
}

const getDirection = (from: Point, to: Point): [Direction, Direction] => {
  const [x1, y1] = from
  const [x2, y2] = to
  
  const deltaX = getDelta(x1, x2)
  const deltaY = getDelta(y1, y2)

  return [deltaX, deltaY]
}

const expandLines = (from: Point, to: Point) => {
  const [directionX, directionY] = getDirection(from, to)
  
  const [x1, y1] = from
  const [x2, y2] = to
  const points: Point[] = []
  
  for (let i = 0;; i++) {
    const [lastX, lastY] = points[points.length - 1] || []
    if (lastX === x2 && lastY === y2) { return points }

    const x = x1 + (directionX * i)
    const y = y1 + (directionY * i)
    points.push([x, y])
  }
}

const determineOverlaps = (paths: Path[]) => {
  const expandedPaths = paths
    .flatMap(([from, to]) => expandLines(from, to))
    
  return count(expandedPaths, ([x, y]) => `${x},${y}`)
    .filter(({count}) => count >= 2)
    .length
}

const part1 = (paths: Path[]) => {
  return determineOverlaps(paths.filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2))
}

const part2 = (paths: Path[]) => {
  return determineOverlaps(paths)
}

describe('Day 5/1', () => {
  it('points 1,1 and 1,3 expand to 1,1 1,2 1,3', () => {
    assertThat(expandLines([1,1], [1,3]), containsInAnyOrder([1,1], [1,2], [1,3]))
  })

  it('points 1,1 and 1,3 expand to 1,1 1,2 1,3', () => {
    assertThat(expandLines([1,3], [1,1]), containsInAnyOrder([1,1], [1,2], [1,3]))
  })

  it('points 1,1 and 1,3 expand to 1,1 1,2 1,3', () => {
    assertThat(expandLines([1,1], [3,3]), containsInAnyOrder([1,1], [2,2], [3,3]))
  })

  it('points 1,1 and 1,3 expand to 1,1 1,2 1,3', () => {
    assertThat(expandLines([3,3],[1,1]), containsInAnyOrder([1,1], [2,2], [3,3]))
  })

  it('points 1,1 and 3,1 expand to 1,1 2,1 3,1', () => {
    assertThat(expandLines([1,1], [3,1]), containsInAnyOrder([1,1], [2,1], [3,1]))
  })

  it('points 3,1, 1,1 expand to 3,1 2,1 1,1', () => {
    assertThat(expandLines([3,1], [1,1]), containsInAnyOrder([3, 1], [2,1], [1,1]))
  })

  it('points 9,7, 7,7 expand to 9,7, 8,7, and 7,7.', () => {
    assertThat(expandLines([9,7], [7,7]), containsInAnyOrder([9,7], [8,7], [7,7]))
  })

  it('determines overlaps', () => {
    const path1: Path = [[1,1], [1,2]]
    const path2: Path = [[1,1], [1,3]]
    assertThat(determineOverlaps([path1, path2]), equalTo(2))
  })
  it('determines overlaps', () => {
    const path1: Path = [[1,1], [2, 1]]
    const path2: Path = [[1,1], [3, 1]]
    assertThat(determineOverlaps([path1, path2]), equalTo(2))
  })

  it('determines overlaps', () => {
    const path1: Path[] = [
      [[3,1], [2,1]],
      [[6,0], [6,5]],
      [[1,5], [9,5]],
      [[4,5], [4,5]],
      [[0,9], [2,9]],
      [[0,9], [5,9]],
    ]
    
    assertThat(determineOverlaps(path1), equalTo(5))
  })

  it('part 1', () => {
    const contents = readFileSync('./src/05/input.txt')
    const paths = contents.toString().split('\n').map((stringPath): Path => {
      const [x1, y1, x2, y2] = stringPath.replace(' -> ', ',')
        .split(',')
        .map((number) => parseInt(number))

      return [[x1, y1], [x2, y2]]
    })

    console.log(part1(paths))
  })

  it('part 2', () => {
    const contents = readFileSync('./src/05/input.txt')
    const paths = contents.toString().split('\n').map((stringPath): Path => {
      const [x1, y1, x2, y2] = stringPath.replace(' -> ', ',')
        .split(',')
        .map((number) => parseInt(number))

      return [[x1, y1], [x2, y2]]
    })

    console.log(part2(paths))
  })
})

