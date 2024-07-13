<script setup lang="ts">
// 禁用 Attributes 继承
// defineOptions({
//   inheritAttrs: false
// })
// 这些透传进来的 attribute 可以在模板的表达式中直接用 $attrs 访问到。
// 这个 $attrs 对象包含了除组件所声明的 props 和 emits 之外的所有其他 attribute，例如 class，style，v-on 监听器等等。

// 在 <script setup> 中使用 useAttrs() API 来访问一个组件的所有透传 attribute：
// 需要注意的是，虽然这里的 attrs 对象总是反映为最新的透传 attribute，但它并不是响应式的 (考虑到性能因素)。
// 你不能通过侦听器去监听它的变化。如果你需要响应性，可以使用 prop
import { USER_KEY } from '@/constants/provideKeys'
import { inject, useAttrs } from 'vue'
const attrs = useAttrs()

// const p = new Promise((resolve) => {
//   resolve(1)
// })

// const pVal = await p
// console.log(111, pVal)

// 一个组件需要显式声明它所接受的 props，这样 Vue 才能知道外部传入的哪些是 props，哪些是透传 attribute
defineProps<{
  childMsg?: string | number
}>()

// 我们在 <template> 中使用的 $emit 方法不能在组件的 <script setup> 部分中使用，但 defineEmits() 会返回一个相同作用的函数供我们使用：
// 声明触发的事件
const emit = defineEmits({
  // 没有校验
  click: null,

  someEvent: null,

  submit1(payload: { email: string; password: string }) {
    // 通过返回值为 `true` 还是为 `false` 来判断
    // 验证是否通过
    return payload.email && payload.password
  },
  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

// 多个 v-model 绑定
// defineModel() 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：
// 它的 .value 和父组件的 v-model 的值同步；
// 当它被子组件变更了，会触发父组件绑定的值一起更新。
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
// 为了能够基于修饰符选择性地调节值的读取和写入方式，我们可以给 defineModel() 传入 get 和 set 这两个选项。
const [model, modifiers] = defineModel({
  set(value: string) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})

// 如果提供的值是一个 ref，注入进来的会是该 ref 对象，而不会自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。
const userName = inject(USER_KEY)
</script>

<template>
  <!-- 和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。如果 $attrs 没有被显式绑定，将会抛出一个运行时警告。 -->
  <div v-bind="$attrs">xxxx</div>
  <!-- 当一个组件以单个元素为根作渲染时，透传的 attribute 会自动被添加到根元素上。class id style -->
  <!-- 如果原生 button 元素自身也通过 v-on 绑定了一个事件监听器，则这个监听器和从父组件继承的监听器都会被触发。 -->
  <div class="child-comp">
    <div>child comp {{ userName }}</div>
    {{ childMsg }}
    <!-- 在组件的模板表达式中，可以直接使用 $emit 方法触发自定义事件 -->
    <!-- 所有传入 $emit() 的额外参数都会被直接传向监听器。举例来说，$emit('foo', 1, 2, 3) 触发后，监听器函数将会收到这三个参数值。 -->
    <button @click="$emit('someEvent')">Click Me</button>
    <input v-model="model" />
    <input v-model="firstName" />
    <input v-model="lastName" />
    <!-- <slot> 元素是一个插槽出口 (slot outlet)，标示了父元素提供的插槽内容 (slot content) 将在哪里被渲染。名称默认为default -->
    <!-- 可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes： -->
    <slot text="向默认插槽的出口上传递 attributes">
      默认插槽内容
      <!-- 默认内容 -->
    </slot>
    <!-- 条件插槽  结合$slots 属性与 v-if 来实现 -->
    <span v-if="$slots.left" class="slot-left">
      <!-- 注意插槽上的 name 是一个 Vue 特别保留的 attribute，不会作为 props 传递给插槽 -->
      <slot name="left" text="向left插槽的出口上传递 attributes" />
    </span>
    <slot name="right"></slot>
  </div>
</template>

<style scoped>
.child-comp {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.slot-left {
  color: red;
}
</style>
