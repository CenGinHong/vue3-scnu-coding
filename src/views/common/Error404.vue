<template>
  <a-result status="404" title="404" sub-title="你好像迷路了噢">
    <template #extra>
      <a-button type="primary" @click="handleRouterToHomepage">Back Home</a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { redirectToHomePage } from '../../router/routerGurad'
import { RoleEnum } from '../../enums/roleEnum'
import { ROUTER_NAME } from '../../router'
export default defineComponent({
  name: 'Error404',
  setup () {
    const router = useRouter()
    const handleRouterToHomepage = () => {
      router.push(redirectToHomePage())
    }
    return {
      handleRouterToHomepage
    }
  }
})
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
