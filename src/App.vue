<template>
  <div id="app">
    <!--TODO: Add loader here -->
    <Layout @logout="logoutUser">
      <router-view
        :username="username"
        :avatarUrl="avatarUrl"
        @logout="logoutUser"
      />
    </Layout>

    <notifications :ignoreDuplicates="true" :duration="5000" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Layout from "@/layouts/Layout.vue";
import { deleteSubscription } from "@/_helpers/pushNotification";
import { mapActions, mapGetters } from "vuex";
import { deleteUser } from "@/util";

@Options({
  name: "App",
  components: { Layout },
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
export default class App extends Vue {}
</script>
