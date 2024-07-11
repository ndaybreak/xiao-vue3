<!-- <script setup> 中的顶层的导入、声明的变量和函数可在同一组件的模板中直接使用。
 你可以理解为模板是在同一作用域内声明的一个 JavaScript 函数——它自然可以访问与它一起声明的所有内容。 -->
<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onErrorCaptured,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  watch,
  watchPostEffect,
  watchSyncEffect
} from 'vue'

// todo 接受路由参数

// 我们可以通过 defineEmits 宏来声明需要抛出的事件
// 和 defineProps 类似，defineEmits 仅可用于 <script setup> 之中，并且不需要导入，它返回一个等同于 $emit 方法的 emit 函数。它可以被用于在组件的 <script setup> 中抛出事件，因为此处无法直接访问 $emit：
const emit = defineEmits(['enlarge-text'])
emit('enlarge-text')

// defineProps 是一个仅 <script setup> 中可用的编译宏命令，并不需要显式地导入。声明的 props 会自动暴露给模板。defineProps 会返回一个对象，其中包含了可以传递给组件的所有 props：
// defineProps<{
//   msg: string
// }>()

// 在组合式 API 中，推荐使用 ref() 函数来声明响应式状态：
// Ref 可以持有任何类型的值，包括深层嵌套的对象、数组或者 JavaScript 内置的数据结构，比如 Map。
// 非原始值将通过 reactive() 转换为响应式代理.
const id = ref()
// .value 属性给予了 Vue 一个机会来检测 ref 何时被访问或修改。在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发
id.value = '123'
// DOM 更新时机  当你修改了响应式状态时，DOM 会被自动更新。但是需要注意的是，DOM 更新不是同步的。
// Vue 会在“next tick”更新周期中缓冲所有状态的修改，以确保不管你进行了多少次状态修改，每个组件都只会被更新一次。
const cls = ref('cls')

// 另一种声明响应式状态的方式，即使用 reactive() API。与将内部值包装在特殊对象中的 ref 不同，reactive() 将使对象本身具有响应性：
// reactive() 将深层地转换对象：当访问嵌套对象时，它们也会被 reactive() 包装。
// 当 ref 的值是一个对象时，ref() 也会在内部调用它。
// reactive() 的局限性
// 1. 有限的值类型：它只能用于对象类型 (对象、数组和如 Map、Set 这样的集合类型)。它不能持有如 string、number 或 boolean 这样的原始类型。
// 2. 不能替换整个对象：由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失
// 3. 对解构操作不友好：当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接：
const state = reactive({ count: 1 })

const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}

const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})
// 使用计算属性来描述依赖响应式状态的复杂逻辑
// computed() 方法期望接收一个 getter 函数，返回值为一个计算属性 ref。
// 和其他一般的 ref 类似，你可以通过 publishedBooksMessage.value 访问计算结果。
// 计算属性 ref 也会在模板中自动解包，因此在模板表达式中引用时无需添加 .value。
// Vue 的计算属性会自动追踪响应式依赖。它会检测到 publishedBooksMessage 依赖于 author.books，所以当 author.books 改变时，任何依赖于 publishedBooksMessage 的绑定都会同时更新。
// 计算属性值会基于其响应式依赖被缓存
// 计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，不要改变其他状态、在 getter 中做异步请求或者更改 DOM
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})

const items = ref([{ message: 'Foo' }, { message: 'Bar' }])

function say(message: string, event: MouseEvent) {
  alert(message)
  // 这里可以访问原生事件
  if (event) {
    event.preventDefault()
  }
}

const inputVal = ref('')

// 注册一个钩子，在组件被挂载之前被调用。
onBeforeMount(() => {})

// 注册一个回调函数，在组件挂载完成后执行。
onMounted(() => {})

// 注册一个钩子，在组件即将因为响应式状态变更而更新其 DOM 树之前调用。
onBeforeUpdate(() => {})

// 注册一个回调函数，在组件因为响应式状态变更而更新其 DOM 树之后调用。
onUpdated(() => {})

// 注册一个钩子，在组件实例被卸载之前调用。
onBeforeUnmount(() => {})

// 注册一个回调函数，在组件实例被卸载之后调用。
onUnmounted(() => {})

// 注册一个钩子，在捕获了后代组件传递的错误时调用。
onErrorCaptured(() => {})

// 注册一个回调函数，若组件实例是 <KeepAlive> 缓存树的一部分，当组件被插入到 DOM 中时调用。
// onActivated  onDeactivated()

// 侦听数据源类型
// watch 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组
// 注意，你不能直接侦听响应式对象的属性值，例如:
// 错误，因为 watch() 得到的参数是一个 number
// watch(obj.count, (count) => {
//   console.log(`Count is: ${count}`)
// })
// 这里需要用一个返回该属性的 getter 函数：
const obj = reactive({ count: 0 })
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
// 直接给 watch() 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：
watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})
// 相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调：
// 你也可以给上面这个例子显式地加上 deep 选项，强制转成深层侦听器：
// watch(
//   () => state.someObject,
//   () => {
//     // 仅当 state.someObject 被替换时触发
//   },
// {deep: true}
// )
// 我们可以通过传入 immediate: true 选项来强制侦听器的回调立即执行：
// watchEffect 仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。
// watch 只追踪明确侦听的数据源。
// watchEffect，则会在副作用发生期间追踪依赖.
// 如果想在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM，你需要指明 flush: 'post' 选项：
// 后置刷新的 watchEffect() 有个更方便的别名 watchPostEffect()：
watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
// 你还可以创建一个同步触发的侦听器，它会在 Vue 进行任何更新之前触发：
// 同步触发的 watchEffect() 有个更方便的别名 watchSyncEffect()：
watchSyncEffect(() => {
  /* 在响应式数据变化时同步执行 */
})

// 如果一个子组件使用的是选项式 API 或没有使用 <script setup>，被引用的组件实例和该子组件的 this 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。
// 有一个例外的情况，使用了 <script setup> 的组件是默认私有的：一个父组件无法访问到一个使用了 <script setup> 的子组件中的任何东西，除非子组件在其中通过 defineExpose 宏显式暴露：
// 子组件可以通过调用内置的 $emit 方法，通过传入事件名称来抛出一个事件：
// <button @click="$emit('enlarge-text')">Enlarge text</button>
</script>

<!-- 当一个组件首次渲染时，Vue 会追踪在渲染过程中使用的每一个 ref。然后，当ref 被修改时，它会触发追踪它的组件的重新渲染。 -->
<template>
  <div class="lerning">
    <!-- 
      指令是带有 v- 前缀的特殊 attribute, 一个指令的任务是在其表达式的值变化时响应式地更新 DOM.
      双大括号不能在 HTML attributes 中使用。想要响应式地绑定一个 attribute，应该使用 v-bind 指令：
      同名简写： 与 v-bind:id="id" 相同 
    -->
    <!-- 为了方便起见，当在模板中使用时，ref 会自动解包 (有一些注意事项)。 -->
    <h1 :id>This is an lerning page</h1>
    <div v-bind="objectOfAttrs">动态绑定多个值</div>
    <!-- 模板中的表达式将被沙盒化，仅能够访问到有限的全局对象列表。该列表中会暴露常用的内置全局对象，比如 Math 和 Date。 -->
    <div>当前日期：{{ new Date().toLocaleDateString() }}</div>
    <!-- 动态参数表达式因为某些字符的缘故有一些语法限制，比如空格和引号，在 HTML attribute 名称中都是不合法的: :['xx' + cls] -->
    <div :[cls]="cls">xx</div>
    <div>状态值：{{ state.count }}</div>
    <span>{{ publishedBooksMessage }}</span>
    <div v-for="(item, index) in items" v-bind:key="index">
      {{ item.message }}
    </div>

    <div>
      <!-- 内联事件处理器：事件被触发时执行的内联 JavaScript 语句 (与 onclick 类似)。 -->
      <!-- 使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。
       因此使用 @click.prevent.self 会阻止元素及其子元素的所有点击事件的默认行为，
       而 @click.self.prevent 则只会阻止对元素本身的点击事件的默认行为。
       .passive 修饰符一般用于触摸事件的监听器，可以用来改善移动端设备的滚屏性能。
       请勿同时使用 .passive 和 .prevent，因为 .passive 已经向浏览器表明了你不想阻止事件的默认行为。如果你这么做了，则 .prevent 会被忽略，并且浏览器会抛出警告。
        -->
      <button @click="say('hello', $event)">在内联处理器中调用方法</button>
    </div>

    <div>
      <!-- v-model 会忽略任何表单元素上初始的 value、checked 或 selected attribute。它将始终将当前绑定的 JavaScript 状态视为数据的正确来源。你应该在 JavaScript 中使用响应式系统的 API来声明该初始值。 -->
      <!-- 默认情况下，v-model 会在每次 input 事件后更新数据 (IME 拼字阶段的状态例外)。你可以添加 lazy 修饰符来改为在每次 change 事件后更新数据： -->
      <input type="text" v-model.lazy="inputVal" />
      <!-- 如果你想让用户输入自动转换为数字，你可以在 v-model 后添加 .number 修饰符来管理输入：
       如果该值无法被 parseFloat() 处理，那么将返回原始值。
      number 修饰符会在输入框有 type="number" 时自动启用。 -->
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .lerning {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
