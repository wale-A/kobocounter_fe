<template>
  <header id="lg">
    <div class="logo" style="padding: 1em 0; margin-left: -0.5em">
      <img src="/img/assets/logo-blue.svg" style="width: 90%" />
    </div>
  </header>
  <section class="flex">
    <div class="bw">
      <AccountSideBar />
    </div>
    <slot />
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AccountSideBar from "@/components/layout/AccountSideBar.vue";
@Options({
  components: {
    AccountSideBar,
  },
})
export default class Account extends Vue {}
</script>
