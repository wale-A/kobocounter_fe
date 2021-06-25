<template>
  <Header :display-menu="true" />
  <main
    class="container"
    style="padding: 15px"
    v-show="accounts && accounts?.length > 0"
  >
    <section style="margin-bottom: 30px">
      <AccountItem
        v-for="(account, index) in accounts"
        :key="index"
        :id="account.id"
        :bank="account.bankName"
        :accountNumber="account.accountNumber"
        :balance="account.balance"
        :currency="account.currency"
        :type="account.type"
        :status="account.status"
      />
    </section>
  </main>

  <AddNewAccount :hasAccounts="accounts != undefined && accounts?.length > 0" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import { mapGetters } from "vuex";
import AccountItem from "@/components/AccountItem.vue";
import AddNewAccount from "@/components/AddNewAccount.vue";

@Options({
  components: {
    Header,
    AccountItem,
    AddNewAccount,
  },
  created() {
    this.$store.dispatch("getAccounts");
  },
  computed: {
    ...mapGetters(["accounts"]),
  },
})
export default class Manage extends Vue {}
</script>

<style scoped>
.container {
  margin: 3% 20%;
}

@media screen and (max-width: 700px) {
  .container {
    margin: 2%;
  }
}
</style>
