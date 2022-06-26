<template>
  <div class="dashboard">
    <AppSideBar :menu-items="menus" @logout="$emit('logout')" />
    <slot />
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
