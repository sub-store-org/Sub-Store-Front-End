import surge from '@/assets/icons/surge.png';
import clash from '@/assets/icons/clash.png';
import quanx from '@/assets/icons/quanx.png';
import loon from '@/assets/icons/loon.png';
import stash from '@/assets/icons/stash.png';
import node from '@/assets/icons/node.svg?url';

import { useGlobalStore } from '@/store/global';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export const useBackend = () => {
  const globalStore = useGlobalStore();
  const { env } = storeToRefs(globalStore);

  const isEnvReady = computed(() => !!env.value.backend);
  const icon = computed(() => {
    switch (env.value.backend) {
      case 'Surge':
        return surge;
      case 'Clash':
        return clash;
      case 'QX':
        return quanx;
      case 'Loon':
        return loon;
      case 'Stash':
        return stash;
      case 'Node':
        return node;
      default:
        return '';
    }
  });

  return {
    icon,
    env,
    isEnvReady,
  };
};
