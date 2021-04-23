<template>
  <header>
    <nav class="">
      <!-- logo section -->
      <a href="/" id="logo">
        <img src="@/assets/logo.svg" alt="logo" />
        <span id="logo-text" class="darker-text">kobocounter</span>
      </a>
      <div v-if="displayMenu" id="option" class="">
        <i class="material-icons" id="menu">menu</i>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    displayMenu: Boolean,
  },
})
export default class Header extends Vue {
  displayMenu = true;
}
</script>
