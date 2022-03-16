<template>
  <a-result status="404" title="404" sub-title="你好像迷路了噢">
    <template #extra>
      <a-button type="primary" @click="handleRouterToHomepage"
        >Back Home</a-button
      >
    </template>
  </a-result>
</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { redirectToHomePage } from '../../router/routerGurad'

const router = useRouter()
const handleRouterToHomepage = () => {
  router.push(redirectToHomePage())
}
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: white;
  justify-content: center;
  align-items: center;
}
</style>
