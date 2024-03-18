import { defineStore } from "pinia";

export const useCodeStore = defineStore("cmCodeStore", {
  state: (): cmCodeStore => {
    return {
      CmCode: "",
      EditCode: {},
    };
  },
  getters: {},
  actions: {
    setCmCode(i: { toString: () => any }) {
      this.CmCode = i ? i.toString() : "";
    },
    setEditCode( id: string , i: { toString: () => any }) {
      this.EditCode[id] = i ? i.toString() : "";
    },
  },
});
