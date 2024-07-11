import type { InjectionKey, Ref } from 'vue'

export const USER_KEY = Symbol() as InjectionKey<Ref<string>>
