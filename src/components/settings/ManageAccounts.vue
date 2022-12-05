<template>
  <div class="title"><h3>Manage Accounts</h3></div>
  <table v-if="!onMobile && accounts.length">
    <thead>
      <tr>
        <th>Bank Name</th>
        <th>Account Number</th>
        <th>Currency</th>
        <th>Balance</th>
        <th>Status</th>
        <th style="padding-left: 3em"></th>
      </tr>
    </thead>
    <tr v-for="account in accounts" :key="account.id">
      <td>{{ account.bankName }}</td>
      <td>{{ account.accountNumber }}</td>
      <td>{{ account.currency }}</td>
      <td>{{ getAccountBalance(account.balance) }}</td>
      <td :style="{ color: getAccountTextColor(account.status) }">
        {{ account.status }}
      </td>
      <td class="menu" @click="toggleMenu(account.id)">
        <span
          class="material-icons input-left-icon"
          v-show="menuKey != account.id"
          >menu</span
        >
        <span
          class="material-icons input-left-icon"
          v-show="menuKey == account.id"
          >close</span
        >
        <div v-if="menuKey == account.id" class="menu-dropdown">
          <span
            class="material-icons material-icons-outlined input-left-icon trash"
            @click="$emit('deleteAccount', account.id)"
            title="Remove Account"
          >
            delete_outline
          </span>
          <span
            class="material-icons input-left-icon refresh"
            v-if="account.status == 'FAILED'"
            style="color: #007cff"
            @click="$emit('reAuthAccount', account.id)"
            title="Reconnect Account"
          >
            refresh
          </span>
        </div>
      </td>
    </tr>
    <caption>
      Bank accounts
    </caption>
  </table>

  <div
    v-for="account in accounts"
    :key="account.id"
    v-else-if="onMobile && accounts.length"
    class="account-item"
  >
    <main>
      <strong>{{ account.bankName }}</strong>
      <span>{{ account.accountNumber }}</span>
      <span style="font-weight: bold; color: green">{{
        getAccountBalance(account.balance)
      }}</span>
      <span :style="{ color: getAccountTextColor(account.status) }">
        {{ account.status }}
      </span>
    </main>
    <aside class="menu" @click="toggleMenu(account.id)">
      <span class="material-icons input-left-icon" v-if="menuKey != account.id"
        >menu</span
      >
      <span class="material-icons input-left-icon" v-else>close</span>
      <div v-if="menuKey == account.id" class="menu-dropdown">
        <span @click="$emit('deleteAccount', account.id)" class="trash">
          Remove Account
        </span>
        <span
          style="color: #007cff"
          v-if="account.status == 'FAILED'"
          @click="$emit('reAuthAccount', account.id)"
        >
          Reconnect Account
        </span>
      </div>
    </aside>
  </div>

  <AddNewAccount
    :hasAccounts="accounts.length"
    @accountAdded="$emit('accountAdded')"
  />
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
    onMobile: Boolean,
  },
  data() {
    return {
      menuKey: "",
    };
  },
})
export default class ManageAccounts extends Vue {
  menuKey?: string;
  onMobile?: boolean;
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
  getAccountBalance(balance?: number): string {
    if (!balance) return "0";

    return parseFloat(balance.toPrecision(2)).toLocaleString();
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
  margin-top: 5px;
  background: lightgrey;
  right: 10%;

  span {
    padding: 5px;
  }
  span.trash {
    color: red;
  }
}

.account-item {
  main {
    span {
      display: block;
      font-size: smaller;
    }
  }
}

.title {
  margin-bottom: 1.5em;
}

.account-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
  margin-bottom: 1em;
  padding-bottom: 0.5em;

  aside {
    .menu-dropdown {
      width: max-content;
      padding: 10px;
      right: 5%;
      margin-top: 0;

      span {
        display: block;
        padding: 0.7em 10px;
        border-bottom: 1px solid black;
      }
    }
  }
}
</style>
