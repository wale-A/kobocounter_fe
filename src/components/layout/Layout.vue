<template>
  <main>
    <SideBar :section="page" @logout="logoutUser" />
    <section class="pane" style="flex-grow: 1">
      <slot name="header">
        <Header
          :username="username"
          :avatarUrl="avatarUrl"
          @logout="logoutUser"
        />
      </slot>
      <slot />
    </section>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "./Header.vue";
import SideBar from "./SideBar.vue";
import { deleteSubscription } from "@/_helpers/pushNotification";
import { mapActions, mapGetters } from "vuex";
import { deleteUser } from "@/util";
@Options({
  components: {
    Header,
    SideBar,
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
export default class Layout extends Vue {}
</script>
