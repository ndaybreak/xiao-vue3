import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 每个 Vue 应用都是通过 createApp 函数创建一个新的 应用实例：
const app = createApp(App)

// 因为状态管理使用的是setup的方式构建所以我们重写一个$reset并挂载到pinia中,否则在使用reset时会报错
// Error: 🍍: Store "counter" is built using the setup syntax and does not implement $reset().
const pinia = createPinia()
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  store.$reset = () => {
    store.$patch(initialState)
  }
})

app.use(pinia)
app.use(router)

// 应用实例会暴露一个 .config 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，用来捕获所有子组件上的错误：
app.config.errorHandler = (err) => {
  /* 处理错误 */
  console.log(err)
}
// app.component('TodoDeleteButton', TodoDeleteButton)

// 确保在挂载应用实例之前完成所有应用配置！

// 应用实例必须在调用了 .mount() 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串：
// 应用根组件的内容将会被渲染在容器元素里面。容器元素自己将不会被视为应用的一部分。
// ！.mount() 方法应该始终在整个应用配置和资源注册完成后被调用。
// 同时请注意，不同于其他资源注册方法，它的返回值是根组件实例而非应用实例。
app.mount('#app')
