<template>{{ params }} 订阅编辑页</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { params } = route
</script>

<style lang="scss" scoped></style>
