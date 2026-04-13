<template>
  <nut-picker ref="pickerRef">
    <template v-for="(_, name) in slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </nut-picker>
</template>

<script setup lang="ts">
  import { ref, useSlots } from 'vue';
  import { useDesktopPickerWheel } from '@/hooks/useDesktopPickerWheel';

  const slots = useSlots();
  const pickerRef = ref();

  useDesktopPickerWheel(pickerRef);
</script>
