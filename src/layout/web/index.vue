<template>
  <a-layout :class="style.layout">
    <page-header :class="style.header" />
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
    <!--<a-layout-footer class="footer">Footer</a-layout-footer>-->
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref, useCssModule } from 'vue'
import PageHeader from './header/index.vue'

export default defineComponent({
  name: 'index',
  components: { PageHeader },
  setup () {
    const style = useCssModule()
    return {
      style
    }
  }
})
</script>

<style lang="scss" module>

.header:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
}
.layout {
  display: flex;
  height: 100vh;
  overflow: scroll;
  background: #f3f3f3 url("/src/assets/login.svg");

  .header {
    transition: box-shadow 0.3s;
  }
}


</style>
