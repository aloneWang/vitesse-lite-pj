<script setup lang="ts">
import type { BlockState } from '~/types'

defineProps<{ block: BlockState }>()
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
function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/10'
  if (block.mine)
    return 'bg-red'
  return numberColors[block.adjacentMines]
}
</script>

<template>
  <button
    :class="getBlockClass(block)"
    flex="~" h-10 w-10 items-center justify-center m="0.5" hover:bg-gray
    border="1 gray-400/10"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed">
      <div v-if="block.mine" i-mdi-mine text-white />
      <div v-else font-600>
        {{ block.adjacentMines ? block.adjacentMines : '' }}
      </div>
    </template>
  </button>
</template>
