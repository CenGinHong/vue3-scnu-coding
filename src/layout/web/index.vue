<template>
    <a-layout class="layout">
      <page-header class="header"/>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <GlobalFooter
          class="footer"
          copyright="2021 &copy; SCNU"
      />
    </a-layout>
</template>

<script lang="ts" setup>
import PageHeader from './header/index.vue'
import { GlobalFooter } from '@ant-design-vue/pro-layout'

</script>

<style lang="scss" scoped>

.layout {
  background: #f3f3f3 url('/src/assets/login.svg');
}
</style>
