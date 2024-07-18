<script setup lang="ts">
import { defineAsyncComponent, provide, ref } from 'vue'
import { USER_KEY } from '@/constants/provideKeys'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

const addOne = () => {
  // counter.$patch({ count: counter.count + 1 })
  counter.increment()
}

const reset = () => {
  // counter.$patch({ count: counter.count + 1 })
  counter.$reset()
}
</script>

<template>
  <div class="xiao-store">
    <h1>This is an store page</h1>
    <div>
      {{ counter.count }}
      <button @click="addOne">加1</button>
      <button @click="reset">reset</button>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .xiao-store {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
