<!-- 全局注册，但并没有被使用的组件无法在生产打包时被自动移除 (也叫“tree-shaking”)。如果你全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中。
 局部注册的组件需要在使用它的父组件中显式导入，并且只能在该父组件中使用。它的优点是使组件之间的依赖关系更加明确，并且对 tree-shaking 更加友好。 -->
<script setup lang="ts">
import { defineAsyncComponent, provide, ref } from 'vue'
// import ChildComp from '../components/ChildComponent.vue'
import { USER_KEY } from '@/constants/provideKeys'

// const p = new Promise((resolve) => {
//   resolve(1)
// })

// const pVal = await p
// console.log(111, pVal)

const post = {
  id: 1,
  title: 'My Journey with Vue'
}

const eventCb = () => {
  alert('click')
}

const model = ref('')
const firstName = ref('')
const lastName = ref('')

// 一个父组件相对于其所有的后代组件，会作为依赖提供者。任何后代的组件树，无论层级有多深，都可以注入由父组件提供给整条链路的依赖。
provide(USER_KEY, ref('xiao'))

const AsyncChildComponent = defineAsyncComponent(() => import('../components/ChildComponent.vue'))

// lazy.js 及其依赖会被拆分到一个单独的文件中
// 并只在 `loadLazy()` 调用时才加载
// function loadLazy() {
//   return import('./lazy.js')
// }
</script>

<template>
  <div class="xiao-comp">
    <h1>This is an comp page</h1>
    <!-- 虽然 `42` 是个常量，我们还是需要使用 v-bind, 因为这是一个 JavaScript 表达式而不是一个字符串 -->
    <!-- <Suspense> -->
    <AsyncChildComponent
      :child-msg="42"
      @some-event="eventCb"
      v-model.capitalize="model"
      v-model:first-name="firstName"
      v-model:last-name="lastName"
      class="abcd"
    >
      <!-- 默认插槽如何接受 props: 通过子组件标签上的 v-slot 指令，直接接收到了一个插槽 props 对象  v-slot="slotProps" -->
      <!-- {{ slotProps.text }} -->

      <!-- 具名作用域插槽的工作方式也是类似的，插槽 props 可以作为 v-slot 指令的值被访问到：v-slot:name="slotProps" -->

      <!-- 要为具名插槽传入内容，我们需要使用一个含 v-slot 指令的 <template> 元素，并将目标插槽的名字传给该指令： -->
      <!-- <template #footer> 简写 </template> -->
      <!-- 如果同时使用了具名插槽与默认插槽，则需要为默认插槽使用显式的 <template> 标签。尝试直接为组件添加 v-slot 指令将导致编译错误。
        这是为了避免因默认插槽的 props 的作用域而困惑 -->
      <template v-slot:default="defaultProps"> default slot({{ defaultProps.text }}) </template>
      <template v-slot:left="leftProps"> left slot({{ leftProps.text }}) </template>
      <template v-slot:right> right slot </template>
    </AsyncChildComponent>
    <!-- </Suspense> -->

    <span>{{ model }}</span>
    <span>{{ firstName }}</span>
    <span>{{ lastName }}</span>

    <!-- 使用一个对象绑定多个 prop -->
    <BlogPost v-bind="post" />
  </div>
</template>

<!-- SFC 中的 <style> 标签一般会在开发时注入成原生的 <style> 标签以支持热更新，而生产环境下它们会被抽取、合并成单独的 CSS 文件。 -->
<style>
@media (min-width: 1024px) {
  .xiao-comp {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
