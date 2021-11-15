<template>
  <header id="menu" class="">
    <h1>Hi {{ username }} !</h1>
    <div class="dropdown">
      <img :src="avatarUrl" alt="avatar" class="pointer header-avatar" />
      <div class="dropdown-content">
        <span style="height: 5px; display: block">&nbsp;</span>
        <a href="#" @click.prevent="logoutUser"> Logout </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
#menu {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-right: 10%;
  padding-left: 3%;
}
#menu-option {
  font-size: 2em;
}
.header-avatar {
  width: 40px;
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
  background-color: green;
}
.dropdown-content a {
  /* background-color: #fafafa; */
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
.dropdown:hover {
  /* padding: 0 1em; */
  background-color: #3e8e41;
}

@media screen and (max-width: 900px) {
  .dropdown-content {
    margin-left: -3em;
  }
  .header-avatar {
    width: 32px;
  }
}
</style>

<script lang="ts">
import { mapGetters } from "vuex";
import { Options, Vue } from "vue-class-component";
import { deleteSubscription } from "@/_helpers/pushNotification";

@Options({
  props: {
    displayMenu: Boolean,
  },
  data() {
    return {
      showMenu: this.displayMenu || false,
    };
  },
  methods: {
    logoutUser() {
      deleteSubscription();
      this.$store.commit("logoutUser");
    },
  },
  computed: {
    ...mapGetters(["avatarUrl", "isLoggedIn", "username"]),
  },
})
export default class Header extends Vue {}
</script>
