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
import { deleteUser, getFacets } from "@/util";
import { COMMON_DATES } from "@/config";
import { computed } from "vue";
import dateFormat from "dateformat";

@Options({
  name: "App",
  components: { Layout },
  data() {
    return {
      params: {
        account: "",
        period: {
          name: "last-month",
          ...COMMON_DATES["last-month"],
        },
      },
      filterFields: [],
    };
  },
  computed: {
    ...mapGetters([
      "avatarUrl",
      "username",
      "accounts",
      "accountMap",
      "accountOptionsMap",
    ]),
    paramSummary() {
      if (this.params) {
        const bank = this.accountMap[this.params.account]
          ? `${this.accountMap[this.params.account].bankName} Account`
          : "All Bank Accounts";
        return `Showing ${bank} from ${this.from} to ${this.to}`;
      }
      return "";
    },
    queryParams() {
      // TODO: Generate from params
      return {
        accountId: this.params.account,
        start: this.params.period.start.getTime(),
        end: this.params.period.end.getTime(),
      };
    },
    facets() {
      return getFacets(this.accountOptionsMap);
    },
    to() {
      // TODO: use filter
      return this.formatDate(this.params.period.end);
    },
    from() {
      // TODO: use filter
      return this.formatDate(this.params.period.start);
    },
  },
  provide() {
    // use function syntax so that we can access `this`
    return {
      params: computed(() => this.params),
      facets: computed(() => this.facets),
      queryParams: computed(() => this.queryParams),
      paramSummary: computed(() => this.paramSummary),
      to: computed(() => this.to),
      from: computed(() => this.from),
      setParams: this.setParams,
      setFactes: this.facets,
      addAccount: this.addAccount,
    };
  },
  methods: {
    ...mapActions(["logout"]),
    formatDate(date: Date) {
      return dateFormat(date, "yyyy-mm-dd");
    },
    setParams(params: any) {
      this.params = params;
    },
    setFacets(fields: any[]) {
      this.fieldFields = fields;
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
