<template>
  <nut-button type="primary">{{ $t(`btn.submit`) }}</nut-button>
</template>

<script lang="ts" setup>
  import { useGetDataApi } from '@/api/getData'

  const api = useGetDataApi()
  api
    .getData({ query: 'test' })
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
</script>

<style lang="scss" scoped></style>
