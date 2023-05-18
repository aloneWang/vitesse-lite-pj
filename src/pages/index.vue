<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

const layout = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
</script>

<template>
  <div>Minesweeper</div>
  <button v-for="(r, i) in layout" :key="i" h-5 w-5 border="1">
    <button v-for="(c, _i) in r" :key="_i" h-5 w-5 border="1">
      {{ c }}
    </button>
  </button>
</template>
