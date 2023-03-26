<template>
  <header id="lg">
    <div class="logo" style="padding: 1em 0; margin-left: -0.5em">
      <router-link :to="{ name: 'Home' }">
        <img src="/img/assets/logo.png" style="width: 70%" alt="logo" />
      </router-link>
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
import AccountSideBar from "@/components/layout/AccountSideBar.vue";
import { Options, Vue } from "vue-class-component";
@Options({
  components: {
    AccountSideBar,
  },
})
export default class Account extends Vue {}
</script>
