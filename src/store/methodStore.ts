// src/stores/methodStore.ts
import { defineStore } from "pinia";

// 定义方法类型
type StoredMethod = (...args: any[]) => void;

// 定义 store 的状态接口
type MethodStoreState = {
  methods: Record<string, StoredMethod>;
};

export const useMethodStore = defineStore("methodStore", {
  // 状态
  state: (): MethodStoreState => ({
    methods: {},
  }),

  // 动作
  actions: {
    // 注册方法
    registerMethod(key: string, method: StoredMethod) {
      this.methods[key] = method;
    },

    // 调用特定方法
    invokeMethod(key: string, ...args: any[]) {
      const method = this.methods[key];
      if (method) {
        method(...args);
      } else {
        console.warn(`Method with key "${key}" not found`);
      }
    },

    // 移除方法
    removeMethod(key: string) {
      delete this.methods[key];
    },

    // 检查方法是否存在
    hasMethod(key: string): boolean {
      return !!this.methods[key];
    },
  },
});
