<template>
  <div class="title"><h3>Bank Accounts</h3></div>
  <table>
    <thead>
      <tr>
        <th>Bank Name</th>
        <th>Account Number</th>
        <th>Currency</th>
        <th>Type</th>
        <th>Balance</th>
        <th>Status</th>
        <th style="padding-left: 3em"></th>
      </tr>
    </thead>
    <tr v-for="account in accounts" :key="account.id">
      <td>{{ account.bankName }}</td>
      <td>{{ account.accountNumber }}</td>
      <td>{{ account.currency }}</td>
      <td>{{ account.type.replaceAll("_", " ") }}</td>
      <td>{{ parseFloat(account.balance.toFixed(2)).toLocaleString() }}</td>
      <td :style="{ color: getAccountTextColor(account.status) }">
        {{ account.status }}
      </td>
      <td class="menu">
        <span
          @click="toggleMenu(account.id)"
          class="material-icons input-left-icon"
          v-show="menuKey != account.id"
          >menu</span
        >
        <span
          @click="toggleMenu(account.id)"
          class="material-icons input-left-icon"
          v-show="menuKey == account.id"
          >close</span
        >
        <div v-show="menuKey == account.id" class="menu-dropdown">
          <a
            href="#"
            class="material-icons input-left-icon trash"
            @click.prevent="$emit('deleteAccount', account.id)"
          >
            delete
          </a>
          <a
            href="#"
            class="material-icons input-left-icon refresh"
            v-show="account.status == 'FAILED'"
            style="color: #007cff"
            @click.prevent="$emit('reAuthAccount', account.id)"
          >
            refresh
          </a>
        </div>
      </td>
    </tr>
    <caption>
      Bank accounts
    </caption>
  </table>

  <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" />
</template>

<script lang="ts">
import { Account } from "@/types";
import { Options, Vue } from "vue-class-component";
import AddNewAccount from "../AddNewAccount.vue";
@Options({
  components: {
    AddNewAccount,
  },
  props: {
    accounts: Array,
  },
  data() {
    return {
      menuKey: "",
    };
  },
})
export default class ManageAccounts extends Vue {
  menuKey?: string;
  accounts: Account[] = [];

  getAccountTextColor(status: string): string {
    if (status === "AVAILABLE") {
      return "#00FF00";
    } else if (status === "PROCESSING") {
      return "#DADA06";
    } else {
      return "#FF0000";
    }
  }

  toggleMenu(key: string): void {
    if (this.menuKey == key) {
      this.menuKey = "";
    } else {
      this.menuKey = key;
    }
  }
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}
tr {
  border-bottom: 1px solid #e5e5e5;
  font-size: 14px;
}
.menu-dropdown {
  position: absolute;
  padding: 5px;
  margin-top: 10px;
  background: lightgrey;

  a {
    padding: 5px;
  }
  a.trash {
    color: red;
  }
}
</style>
