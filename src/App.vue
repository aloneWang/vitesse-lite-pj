<script setup lang="ts">
import GameSuccess from './components/GameSuccess.vue'
import { MineGame } from '~/composables/mineslogic'

type GameDifficuly = 'easy' | 'middle' | 'hard'
const game = new MineGame(9, 9, 10)
const now = $(useNow())
const timerMS = $computed(() => Math.round(((game.state.value.endMS ?? +now) - (game.state.value.startMS ?? +now)) / 1000))
const fakerMineslen = computed(() => game.mines - game.state.value.flaggedLen)
useStorage('vue-swipper-state', game.state)

function newGanme(difficulty?: GameDifficuly) {
  switch (difficulty) {
    case 'easy':
      game.reset(9, 9, 10)
      break
    case 'middle':
      game.reset(16, 16, 40)
      break
    case 'hard':
      game.reset(25, 25, 99)
      break
    default:game.reset()
      break
  }
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <TheFooter />
    <div>Minesweeper</div>
    <div flex="~" justify-center gap-1 p4>
      <div btn @click="newGanme()">
        new game
      </div>
      <div btn @click="newGanme('easy')">
        easy
      </div>
      <div btn @click="newGanme('middle')">
        middle
      </div>
      <div btn @click="newGanme('hard')">
        hard
      </div>
    </div>
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
    <div v-for="r, i in game.board" :key="i" flex="~" items-center justify-center>
      <MineBlock
        v-for=" block, _i in r" :key="_i" :block="block"
        @click="game.blockClick(block)"
        @contextmenu.prevent="game.rightClick(block)"
      />
    </div>
    <GameSuccess :passed="game.mineBoxStatus === 'SUCCESS'" />
  </main>
</template>
