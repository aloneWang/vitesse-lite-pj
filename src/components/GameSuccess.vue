<script setup lang="ts">
import confetti from 'canvas-confetti'

const props = defineProps<{
  passed: boolean
}>()
const duration = 3 * 1000
function congratulationFrame(dura: number) {
  // launch a few confetti from the left edge
  confetti({
    particleCount: 7,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 1 },
  })
  // and launch a few from the right edge
  confetti({
    particleCount: 7,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 1 },
  })
  if (dura > 0) {
    // 1000/60
    requestAnimationFrame(() => congratulationFrame(dura - (1000 / 60)))
  }
}
watchEffect(() => {
  if (props.passed)
    congratulationFrame(duration)
})
</script>

<template>
  <div />
</template>
