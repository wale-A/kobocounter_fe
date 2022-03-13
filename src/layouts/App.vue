<template>
  <main class="dashboard">
    <AppSideBar :section="page" @logout="logoutUser" />
    <section class="pane" style="flex-grow: 1">
      <Header
        :username="username"
        :avatarUrl="avatarUrl"
        @logout="logoutUser"
      />
      <slot />
    </section>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "../components/layout/Header.vue";
import AppSideBar from "../components/layout/AppSideBar.vue";
import { deleteSubscription } from "@/_helpers/pushNotification";
import { mapActions, mapGetters } from "vuex";
import { deleteUser } from "@/util";
@Options({
  components: {
    Header,
    AppSideBar,
  },
  props: {
    page: String,
  },
  computed: {
    ...mapGetters(["avatarUrl", "username"]),
  },
  methods: {
    ...mapActions(["logout"]),
    logoutUser() {
      deleteSubscription();
      this.logout().then(() => {
        deleteUser();
        this.$router.replace({ name: "Home" });
      });
    },
  },
})
export default class Default extends Vue {}
</script>
