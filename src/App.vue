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
import { Options, Vue } from "vue-class-component";
import Layout from "@/layouts/Layout.vue";
import { deleteSubscription } from "@/_helpers/pushNotification";
import { mapActions, mapGetters } from "vuex";
import { deleteUser } from "@/util";
import dateFormat from "dateformat";

@Options({
  name: "App",
  components: { Layout },
  computed: {
    ...mapGetters(["avatarUrl", "username"]),
  },
  provide() {
    // use function syntax so that we can access `this`
    return {
      formatDate: this.formatDate,
      getModels: this.getModels,
      getFacets: this.getFacets,
      getQuery: this.getQuery,
      addAccount: this.addAccount,
    };
  },
  methods: {
    ...mapActions(["logout"]),
    formatDate(date: Date) {
      return dateFormat(date, "yyyy-mm-dd");
    },
    getFacets(fields: Record<string, any>, args: Record<string, any>) {
      return Object.keys(fields).map((key) => {
        if (typeof fields[key] === "function" && args[key]) {
          return fields[key](args[key]);
        }
        return fields[key];
      });
    },
    getModels(facets: Record<string, any>[]) {
      return facets.reduce((acc, facet) => {
        let value;
        if (typeof facet.modelDefault === "function") {
          value = facet.modelDefault();
        } else {
          value = facet.modelDefault;
        }
        return {
          ...acc,
          [facet.key]: value,
        };
      }, {});
    },
    getQuery(facets: Record<string, any>[], model: Record<string, any>) {
      return facets.reduce(
        (acc: Record<string, string>, item: Record<string, any>) => {
          return {
            ...acc,
            ...item.getParams(model),
          };
        },
        {}
      );
    },
    addAccount() {
      const addAccountFn = (code: string) =>
        this.$store.dispatch("addAccount", { code });
      const options = {
        onSuccess: function (response: { code: string }) {
          addAccountFn(response.code);
        },
      };
      this.$launchMono(options);
    },
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
