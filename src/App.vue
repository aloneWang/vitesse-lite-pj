<script setup lang="ts">
interface BlockState {
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
  x: number
  y: number
  revealed: boolean
}
type mineBoardStatus = 'READY' | 'LOST' | 'SUCCESS' | 'PLAY'
const WIDTH = 9
const HEIGHT = 9
const mines = 10
const isDev = false

const minesBoard = reactive(Array.from({ length: HEIGHT }, (_, y) => Array.from({ length: WIDTH }, (_, x): BlockState => ({
  x,
  y,
  adjacentMines: 0,
  revealed: false,
  flagged: false,
}))))

const minesCollect = $ref<BlockState[]>([])
let flaggedLen = $ref(0)
const fakerMineslen = computed(() => mines - flaggedLen)
const now = $(useNow())
let startMs: number
let endMS = $ref<number>()
const timerMS = $computed(() => Math.round(((endMS ?? +now) - (startMs ?? +now)) / 1000))

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
const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]
let mineBoxStatus = $ref<mineBoardStatus>('READY')

function randomInt(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

function getBlockAround({ x, y }: BlockState) {
  return directions.map(([x1, y1]) => {
    const x2 = x + x1
    const y2 = y + y1

    if (x2 >= 0 && x2 < WIDTH && y2 >= 0 && y2 < HEIGHT)
      return minesBoard[y2][x2]

    return false
  }).filter(Boolean) as BlockState[]
}
function generateMine(initila: BlockState) {
  let pause = false
  for (let i = 0; i < mines; i++) {
    pause = false
    while (!pause) {
      const x1 = randomInt(0, WIDTH - 1)
      const y1 = randomInt(0, HEIGHT - 1)
      if ((Math.abs(initila.x - x1) > 1 || Math.abs(initila.y - y1) > 1) && !minesBoard[y1][x1].mine) {
        minesBoard[y1][x1].mine = true
        minesCollect.push(minesBoard[y1][x1])
        pause = true
      }
    }
  }
  // 计算炸弹周围的数字
  minesCollect.forEach(block => calcArountCount(block))
  mineBoxStatus = 'PLAY'
}

function calcArountCount(block: BlockState) {
  getBlockAround(block).forEach((_block: BlockState) => {
    if (!_block.mine)
      _block.adjacentMines++
  })
}

function showZeroBlock(block: BlockState) {
  if (!block.adjacentMines) {
    getBlockAround(block).forEach((_block) => {
      if (!_block.revealed) {
        _block.revealed = true
        showZeroBlock(_block)
      }
    })
  }
}
function showAllMines() {
  minesCollect.forEach((item) => {
    item.revealed = true
  })
}
function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/10'
  if (block.mine)
    return 'bg-red'
  return numberColors[block.adjacentMines]
}

function checkBoard(): mineBoardStatus {
  const noRevealedLen = minesBoard.flat().filter(({ revealed }) => !revealed).length
  if (noRevealedLen === minesCollect.length)
    return 'SUCCESS'

  else if (!noRevealedLen)
    return 'READY'

  else
    return 'PLAY'
}
function blockClick(block: BlockState) {
  if (mineBoxStatus === 'SUCCESS' || mineBoxStatus === 'LOST')
    return
  if (mineBoxStatus === 'READY') {
    generateMine(block)
    startMs = +new Date()
  }

  if (block.revealed || block.flagged)
    return
  if (block.mine) {
    showAllMines()
    endMS = +new Date()
    mineBoxStatus = 'LOST'
    setTimeout(() => alert('you lost'))
  }

  block.revealed = true
  showZeroBlock(block)
  if (checkBoard() === 'SUCCESS') {
    endMS = +new Date()
    mineBoxStatus = 'SUCCESS'
    setTimeout(() => alert('you win'))
  }
}

function rightClick(block: BlockState) {
  if (mineBoxStatus === 'PLAY' && !block.revealed) {
    block.flagged = !block.flagged
    block.flagged ? flaggedLen++ : flaggedLen--
  }
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <TheFooter />
    <div>Minesweeper</div>
    <div flex="~ gap-10" justify-center>
      <div flex="~ gap-1" items-center font-mono text-2xl>
        <div i-carbon-time />
        {{ timerMS }}
      </div>
      <div flex="~ gap-1" items-center font-mono text-2xl>
        <div i-mdi-mine />
        {{ fakerMineslen }}
      </div>
    </div>
    <div v-for="r, i in minesBoard" :key="i" flex="~" items-center justify-center>
      <button
        v-for=" block, _i in r" :key="_i" :class="getBlockClass(block)"
        flex="~" h-10 w-10 items-center justify-center m="0.5" hover:bg-gray
        border="1 gray-400/10"
        @click="blockClick(block)"
        @contextmenu.prevent="rightClick(block)"
      >
        <template v-if="block.flagged">
          <div i-mdi-flag text-red />
        </template>
        <template v-else-if="block.revealed || isDev">
          <div v-if="block.mine" i-mdi-mine text-white />
          <div v-else font-600>
            {{ block.adjacentMines ? block.adjacentMines : '' }}
          </div>
        </template>
      </button>
    </div>
  </main>
</template>
