<template>
  <div class="l-wrapper">
    <aside v-if="!onMobile" class="l-sidebar">
      <AppSideBar :menu-items="menus" @logout="$emit('logout')" />
    </aside>
    <div class="l-content">
      <slot />
    </div>
    <div v-if="onMobile" class="l-tabbar">
      <AppNavBar :menu-items="menus" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppSideBar from "../components/layout/AppSideBar.vue";
import AppNavBar from "../components/layout/AppNavBar.vue";
import { SIDEBAR_MENU_ITEMS } from "@/config";

@Options({
  components: {
    AppSideBar,
    AppNavBar,
  },
  computed: {
    menus() {
      return SIDEBAR_MENU_ITEMS;
    },
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
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
.l-sidebar {
  width: 18%;
}
.l-content {
  flex-grow: 1;
}
.l-tabbar {
  position: fixed;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
