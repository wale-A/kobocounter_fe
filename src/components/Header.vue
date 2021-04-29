<template>
  <header>
    <nav>
      <router-link to="/" id="logo">
        <img src="@/assets/logo.svg" alt="logo" />
        <span id="logo-text" class="darker-color">kobocounter</span>
      </router-link>
      <!-- <a href="/" id="logo"> </a> -->
      <div v-if="displayMenu" id="menu" class="">
        <img v-if="isLoggedIn" :src="avatarUrl" alt="avatar" class="pointer" />
        <i v-else class="material-icons accent-color pointer" id="menu-option"
          >menu</i
        >
      </div>
    </nav>
  </header>
</template>

<style scoped>
#menu {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>

<script lang="ts">
import { mapGetters } from "vuex";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    displayMenu: Boolean,
  },
  computed: {
    ...mapGetters(["avatarUrl", "isLoggedIn"]),
  },
})
export default class Header extends Vue {
  displayMenu = true;
}
</script>
