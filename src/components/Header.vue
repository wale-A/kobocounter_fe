<template>
  <header>
    <nav>
      <router-link :to="{ name: 'Home' }" id="logo">
        <img src="/img/logo.svg" alt="logo" />
        <span id="logo-text" class="darker-color">kobocounter</span>
      </router-link>
      <div v-if="showMenu" id="menu" class="">
        <router-link v-if="isLoggedIn" :to="{ name: 'Dashboard' }">
          <img :src="avatarUrl" alt="avatar" class="pointer" />
        </router-link>
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
    displayMenu: [Boolean],
  },
  data() {
    return {
      showMenu: this.displayMenu || false,
    };
  },
  mounted() {
    //this.$store.commit("getUser");
  },
  computed: {
    ...mapGetters(["avatarUrl", "isLoggedIn"]),
  },
})
export default class Header extends Vue {}
</script>
