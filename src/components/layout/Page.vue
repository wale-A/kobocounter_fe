<template>
  <section class="page">
    <Header
      :username="username"
      :avatarUrl="avatarUrl"
      @logout="$emit('logout')"
      class="sticky"
    >
      <slot v-if="!onMobile" name="actions" />
    </Header>
    <slot />
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "./Header.vue";
@Options({
  name: "Page",
  components: {
    Header,
  },
  props: {
    username: String,
    avatarUrl: String,
  },
  computed: {
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
  },
})
export default class Page extends Vue {}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  overflow: scroll;

  .sticky {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 2000;
  }
}
</style>
