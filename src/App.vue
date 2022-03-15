<template>
<!--  <a-config-provider :locale="locale">-->
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
<!--  </a-config-provider>-->
  <!--<router-view/>-->
  <!--<img alt="Vue logo" src="./assets/logo.png" />-->
  <!--<HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />-->
</template>

<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import HelloWorld from './components/HelloWorld.vue'

dayjs.locale('zh-cn')

const locale = zhCN

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /*margin-top: 60px;*/
}
</style>
