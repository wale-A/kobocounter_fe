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
import { Account } from "./types";
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
    };
  },
  computed: {
    ...mapGetters(["avatarUrl", "username", "accounts"]),
    accountMap() {
      return this.accounts.reduce(
        (acc: Record<string, any>, item: Account) => ({
          ...acc,
          [item.id]: item,
        }),
        {}
      );
    },
    accountOptionsMap() {
      return this.accounts.map((item: Account) => ({
        value: item.id,
        label: `${item.bankName} - ${item.accountNumber}`,
      }));
    },
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
      return dateFormat(this.params.period.end, "yyyy-mm-dd");
    },
    from() {
      // TODO: use filter
      return dateFormat(this.params.period.start, "yyyy-mm-dd");
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
      addAccount: this.addAccount,
    };
  },
  methods: {
    ...mapActions(["logout"]),
    setParams(params: any) {
      this.params = params;
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
