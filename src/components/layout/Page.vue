<template>
  <section class="page">
    <Header
      :username="username"
      :avatarUrl="avatarUrl"
      @logout="$emit('logout')"
      class="page__header"
    >
      <slot v-if="!onMobile" name="actions" />
    </Header>
    <Loader v-if="pageLoading" />
    <slot v-else />
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "./Header.vue";
import Loader from "./Loader.vue";

@Options({
  name: "Page",
  components: {
    Header,
    Loader,
  },
  // these props are passed via the router-view object in ./App.vue
  props: {
    username: String,
    avatarUrl: String,
    pageLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
  },
})
export default class Page extends Vue {
  pageLoading!: boolean;

  created() {
    // console.log({ pgLoading: this.pageLoading });
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  overflow: scroll;

  @at-root #{&}__header {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 2000;
  }
}
</style>
