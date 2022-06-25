import { defineStore } from 'pinia';

const useStore = defineStore('storeName', {
  state: (): StoreState => {
    return {
      data: '',
      name: '',
    };
  },
});
