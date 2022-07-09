import { PropType } from 'vue';

export default {
  subs: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
};
