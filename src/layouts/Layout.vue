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
  }),
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        try {
          const component = await import(`@/layouts/${route.meta.layout}.vue`);
          this.layout = component?.default || Default;
        } catch (e) {
          this.layout = Default;
        }
      },
    },
  },
})
export default class Layout extends Vue {}
</script>
