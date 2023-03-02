<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Default from "./Default.vue";
@Options({
  name: "AppLayout",
  data: () => ({
    layout: Default,
    name: "Default",
  }),
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        try {
          if (!route.meta?.layout || route.meta.layout === this.name) {
            return;
          }
          const component = await import(`../layouts/${route.meta.layout}.vue`);
          if (component?.default) {
            this.layout = component.default;
            this.name = route.meta.layout;
          }
        } catch (e) {
          if (this.name !== "Default") {
            this.name = "Default";
            this.layout = Default;
          }
        }
      },
    },
  },
})
export default class Layout extends Vue {}
</script>
