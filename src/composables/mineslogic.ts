import type { BlockState } from '~/types'

const directions = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
]
type GameStatus = 'READY' | 'PLAY' | 'SUCCESS' | 'LOST'
interface GameMineState {
  status: GameStatus
  board: BlockState[][]
  startMS?: number
  endMS?: number
  flaggedLen: number
  mineCollectque: BlockState[]
}
export class MineGame {
  state = ref() as Ref<GameMineState>
  constructor(
    public width: number,
    public height: number,
    public mines: number) {
    this.reset()
  }

  reset(width = this.width, heigh = this.height, mines = this.mines) {
    this.width = width
    this.height = heigh
    this.mines = mines
    this.state.value = {
      status: 'READY',
      flaggedLen: 0,
      mineCollectque: [],
      board: Array.from({ length: heigh }, (_, y) => Array.from({ length: width }, (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
        flagged: false,
      }))),
    }
  }

  get mineCollectque() {
    return this.state.value.mineCollectque
  }

  set mineCollectque(mineque: BlockState[]) {
    this.state.value.mineCollectque = mineque
  }

  get board() {
    return this.state.value.board
  }

  get mineBoxStatus() {
    return this.state.value.status
  }

  set mineBoxStatus(status: GameStatus) {
    this.state.value.status = status
  }

  randomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }

  getBlockAround({ x, y }: BlockState) {
    return directions.map(([x1, y1]) => {
      const x2 = x + x1
      const y2 = y + y1

      if (x2 >= 0 && x2 < this.width && y2 >= 0 && y2 < this.height)
        return this.board[y2][x2]

      return false
    }).filter(Boolean) as BlockState[]
  }

  generateMine(initila: BlockState) {
    let pause = false
    for (let i = 0; i < this.mines; i++) {
      pause = false

      while (!pause) {
        const x1 = this.randomInt(0, this.width - 1)
        const y1 = this.randomInt(0, this.height - 1)
        const block = this.board[y1][x1]
        if ((Math.abs(initila.x - x1) > 1 || Math.abs(initila.y - y1) > 1) && !block.mine) {
          block.mine = true
          this.mineCollectque.push(block)
          pause = true
        }
      }
    }
    // 计算炸弹周围的数字
    this.mineCollectque.forEach(block => this.calcArountCount(block))
    this.mineBoxStatus = 'PLAY'
  }

  calcArountCount(block: BlockState) {
    this.getBlockAround(block).forEach((_block: BlockState) => {
      if (!_block.mine)
        _block.adjacentMines++
    })
  }

  showZeroBlock(block: BlockState) {
    if (!block.adjacentMines) {
      this.getBlockAround(block).forEach((_block) => {
        if (!_block.revealed) {
          _block.revealed = true
          this.showZeroBlock(_block)
        }
      })
    }
  }

  showAllMines() {
    // string 化后 block 与 block不是同一地址，下面不会更新
    // this.mineCollectque.forEach((item) => {
    //   item.revealed = true
    //   item.flagged = false
    // })
    this.board.flat().forEach((item) => {
      if (item.mine)
        item.revealed = true
    })
  }

  checkBoard(): GameStatus {
    const noRevealedLen = this.board.flat().filter(({ revealed }) => !revealed).length
    if (noRevealedLen === this.mineCollectque.length)
      return 'SUCCESS'

    else if (!noRevealedLen)
      return 'READY'

    else
      return 'PLAY'
  }

  blockClick(block: BlockState) {
    const { mineBoxStatus, state } = this
    if (mineBoxStatus === 'SUCCESS' || mineBoxStatus === 'LOST')
      return
    if (mineBoxStatus === 'READY') {
      this.generateMine(block)
      state.value.startMS = +new Date()
    }

    if (block.revealed || block.flagged)
      return
    if (block.mine) {
      this.showAllMines()
      state.value.endMS = +new Date()
      this.mineBoxStatus = 'LOST'
      setTimeout(() => alert('you lost'))
    }

    block.revealed = true
    this.showZeroBlock(block)
    if (this.checkBoard() === 'SUCCESS') {
      state.value.endMS = +new Date()
      this.mineBoxStatus = 'SUCCESS'
      setTimeout(() => alert('you win'))
    }
  }

  rightClick(block: BlockState) {
    if (this.mineBoxStatus === 'PLAY' && !block.revealed) {
      const state = this.state.value
      block.flagged = !block.flagged
      block.flagged ? state.flaggedLen++ : state.flaggedLen--
    }
  }
}
