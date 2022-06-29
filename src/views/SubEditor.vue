<template>{{ editType === 'sub' ? sub : collection }} 订阅编辑页</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  import { useSubsStore } from '@/store/subs'
  import { watchEffect, ref } from 'vue'

  const route = useRoute()
  const { params } = route
  const { editType, id } = params
  const sub = ref<SubsData>()
  const collection = ref<CollectionsData>()

  const subsStore = useSubsStore()
  watchEffect(() => {
    switch (editType) {
      case 'sub':
        sub.value = subsStore.getOneSub(id as string)
        break
      case 'collection':
        collection.value = subsStore.getOneCollection(id as string)
        break
    }
  })
</script>

<style lang="scss" scoped></style>
