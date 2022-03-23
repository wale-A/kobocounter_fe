<template>
  <div class="l-wrapper">
    <aside class="l-sidebar">
      <AppSideBar :menu-items="menus" @logout="$emit('logout')" />
    </aside>
    <div class="l-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppSideBar from "../components/layout/AppSideBar.vue";
import { SIDEBAR_MENU_ITEMS } from "@/config";

@Options({
  components: {
    AppSideBar,
  },
  computed: {
    menus() {
      return SIDEBAR_MENU_ITEMS;
    },
  },
})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
.l-wrapper {
  display: flex;
  height: 100vh;
}
.l-side-bar {
  width: 248px;
}
.l-content {
  flex-grow: 1;
}
</style>
