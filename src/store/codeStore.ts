import { defineStore } from "pinia";

export const useCodeStore = defineStore("cmCodeStore", {
  state: (): cmCodeStore => {
    return {
      EditCode: {},
      CodeClear: {},
    };
  },
  getters: {},
  actions: {
    setEditCode(id: string, i: { toString: () => any }) {
      this.EditCode[id] = i ? i.toString() : "";
    },
    CodeClear(id: string, i: boolean = false) {
      this.CodeClear[id] = i;
    },
  },
});
