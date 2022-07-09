<template>
  <nut-dialog
    footer-direction="vertical"
    teleport="#app"
    title="顺序调整"
    textAlign="left"
    noCancelBtn
    v-model:visible="visible1"
  >
    <draggable
      class="wrapper"
      v-model="subList"
      @start=""
      @end="scrollEnd"
      item-key="index"
      :scroll="true"
      animation="300"
      handle=".drag-handler"
    >
      <template #item="{ element }">
        <nut-cell :title="element" center>
          <template v-slot:link>
            <div class="drag-handler">
              <font-awesome-icon icon="fa-solid fa-grip" class="fa-lg" />
            </div>
          </template>
        </nut-cell>
      </template>
    </draggable>
  </nut-dialog>
</template>
<script setup lang="ts">
  import draggable from 'vuedraggable';

  import { onMounted, ref } from 'vue';
  import prop from './props';
  const props = defineProps(prop);
  const emits = defineEmits(['update:subs']);
  const drag = ref(false);
  const visible1 = ref(false);
  const subList = ref<string[]>([]);
  function showDialog() {
    visible1.value = true;
  }

  function scrollEnd() {
    drag.value = false;
    console.log('拖动完成');
    emits('update:subs', subList);
  }
  onMounted(() => {
    subList.value = props.subs;
  });
  defineExpose({ showDialog });
</script>
<style lang="scss" scoped></style>
