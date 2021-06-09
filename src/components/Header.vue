<template>
  <header>
    <nav>
      <router-link :to="{ name: 'Home' }" id="logo">
        <img src="/img/logo.svg" alt="logo" />
        <span id="logo-text" class="darker-color">kobocounter</span>
      </router-link>
      <div v-if="showMenu" id="menu" class="">
        <div class="dropdown" v-if="isLoggedIn">
          <img :src="avatarUrl" alt="avatar" class="pointer" />
          <div class="dropdown-content">
            <span style="height: 12px; display: block">&nbsp;</span>
            <router-link :to="{ name: 'Dashboard' }"> Dashboard </router-link>
            <a href="#" @click.prevent="logoutUser"> Logout </a>
          </div>
        </div>
        <div class="dropdown" v-else>
          <i class="material-icons accent-color pointer" id="menu-option"
            >menu</i
          >
          <div class="dropdown-content">
            <span style="height: 12px; display: block">&nbsp;</span>
            <router-link
              :to="{ name: 'Register' }"
              style="border-bottom: 1px solid black"
            >
              Register
            </router-link>
            <router-link :to="{ name: 'Login' }"> Login </router-link>
          </div>
        </div>
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
#menu-option {
  font-size: 2em;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;
  margin-left: -25px;
}
.dropdown-content a {
  background-color: #fafafa;
  color: #1c5298;
  padding: 10px 20px;
  text-decoration: none;
  display: block;
  font-family: Poppins;
  cursor: pointer;
}
.dropdown-content a:hover {
  background-color: #f1f1f1;
  color: #007cff;
}
.dropdown:hover .dropdown-content {
  display: block;
}
.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}

@media screen and (max-width: 700px) {
  .dropdown-content {
    margin-left: -75px;
  }
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
  methods: {
    logoutUser() {
      this.$store.commit("logoutUser");
    },
  },
  computed: {
    ...mapGetters(["avatarUrl", "isLoggedIn"]),
  },
})
export default class Header extends Vue {}
</script>
