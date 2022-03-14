<template>
  <section class="pane" style="flex-grow: 1">
    <Header
      :username="username"
      :avatarUrl="avatarUrl"
      @logout="$emit('logout')"
    >
      <slot name="actions" />
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
})
export default class Page extends Vue {}
</script>
