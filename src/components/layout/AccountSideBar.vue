<template>
  <div class="name">
    <div class="logo" style="padding: 1em 0; margin-left: -0.5em">
      <router-link :to="{ name: 'Home' }">
        <img src="/img/assets/logo-white.svg" style="width: 90%" />
      </router-link>
    </div>
  </div>
  <div class="ilus"><img src="/img/assets/coin.png" /></div>
  <div class="text">
    <h2>Track Your Coins</h2>
    <p>Tired of wondering where all your money went?</p>
    <p>
      Track your spending and expenses across all your bank accounts with a
      single app.
    </p>
  </div>
  <!-- <div class="buttons">
        <router-link
          :to="{ name: 'Register' }"
          style="border-bottom: 1px solid black"
        >
          <button id="gs">Get Started</button>
        </router-link>
        <a href="#"><button id="login">Login</button></a>
      </div> -->
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    section: String,
  },
})
export default class AccountSideBar extends Vue {}
</script>
