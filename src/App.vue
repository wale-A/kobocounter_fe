<template>
  <main>
    <!--TODO: Add loader here -->
    <Layout @logout="logoutUser">
      <router-view
        :username="username"
        :avatarUrl="avatarUrl"
        @logout="logoutUser"
      />
    </Layout>

    <notifications :ignoreDuplicates="true" :duration="5000" />
  </main>
</template>

<script lang="ts">
import { deleteSubscription } from "@/_helpers/pushNotification";
import Layout from "@/layouts/Layout.vue";
import FailedAccountMixin from "@/mixins/FailedAccount";
import NoTransactionMixin from "@/mixins/NoTransaction";
import { deleteUser } from "@/util";
import { Options, mixins } from "vue-class-component";
import { mapActions, mapGetters } from "vuex";

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
        this.$router.push({ name: "Home" });
      });
    },
  },
})
export default class App extends mixins(
  FailedAccountMixin,
  NoTransactionMixin
) {}
</script>
