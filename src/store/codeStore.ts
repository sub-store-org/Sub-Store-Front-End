import { defineStore } from "pinia";

export const useCodeStore = defineStore("cmCodeStore", {
  state: (): cmCodeStore => {
    return {
      CmCode: "",
    };
  },
  getters: {},
  actions: {
    setCmCode(i: { toString: () => any }) {
      this.CmCode = i.toString();
    },
  },
});
